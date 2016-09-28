var RATE = 0.1;
const ADJUSTMENT = 2.;
const MAX_STEPS = 10000;
const MIN_STEPS = 100;
const TOLERANCE = 0.01;

const SOLIDITY_TOLERANCE = 0.09;
const READY = 0.5;
const STRICT_READY = 0.85;
const NOT_READY = 0.5;

//math functions
var sigmoid = function(x) {
  return 1.0 / (1 + Math.exp(-x));
};

var inverseSigmoid = function(x) {
  return -Math.log(x / (1 - x));
};

var box = function(x) {
  return x > 1 ? 1 : (x < 0 ? 0 : x);
};

var cut_negative = function(x) {
  return x >= 0 ? x : 0;
};

var is_in_array = function(array, value) {
  return array.indexOf(value) > 0;
}

var remove_ocurrences_from_array = function(array, value) {
  while (true) {
    var i = array.indexOf(value);
    if (i < 0) {
      return array;
    }
    array.splice(i, 1);
  }
}

var replace_ocurrences_in_array = function(array, old_value, new_value) {
  if (old_value == new_value) {
    return array;
  }
  while (true) {
    var i = array.indexOf(old_value);
    if (i < 0) {
      return array;
    }
    array.splice(i, 1, new_value);
  }
}

var getPersonalProperty = function(property, defaultValue, nodeId, userId) {
  var node = Nodes.findOne({
    _id: nodeId
  });
  var info = Personal.findOne({
    user: userId,
    node: nodeId
  });
  return info ? (info[property] ? info[property] : defaultValue) : defaultValue;
};

var getState = function(nodeId, userId) {
  return getPersonalProperty("state", 0, nodeId, userId);
};

var getSolidity = function(nodeId, userId) {
  return getPersonalProperty("solidity", 0, nodeId, userId);
};

var isLocked = function(nodeId, userId) {
  return getPersonalProperty("locked", false, nodeId, userId);
};

var computeState = function(nodeId, userId, assumptions) {
  var node = Nodes.findOne(nodeId);
  var type = node.type;
  var state;
  var weights = node.needs;
  var bias = node.bias;
  //if it's a microconcept, return its current state
  if (Object.keys(weights).length === 0) {
    if (node.type == "concept") {
      if (typeof assumptions.state !== "undefined" && typeof assumptions.state[nodeId] !== "undefined") {
        state = assumptions.state[nodeId];
      } else {
        state = getState(nodeId, userId);
      }
    } else if (node.type == "content" || node.type == "exam") {
      state = 1;
    }
  } else {
    var arg = bias;
    for (id in weights) {
      if (typeof assumptions.state !== "undefined" && typeof assumptions.state[id] !== "undefined") {
        arg += weights[id] * assumptions.state[id];
      } else {
        arg += weights[id] * getState(id, userId);
      }
    }
    state = sigmoid(arg);
  }
  return state;
};

//todos os nodos acessíveis por um grau de needed_by
var find_forward_layer = function(nodes) {
  var layer = {};
  for (var node_id in nodes) {
    var node = Nodes.findOne(node_id);
    var needed_by = node.needed_by;
    for (var id in needed_by) {
      layer[id] = true;
    }
  }
  return layer;
};

//find forward tree (all nodes that are within reach of outgoing activation links)
var find_forward_tree = function(node_ids) {
  var tree = [];
  var current_layer = node_ids;
  tree.push(current_layer);
  while (1) {
    var next_layer = find_forward_layer(current_layer);
    if (Object.keys(next_layer).length === 0) {
      break;
    }
    tree.push(next_layer);
    current_layer = next_layer;
  }
  return tree;
};

//todos os nodos acessíveis por needs
var find_backward_layer = function(nodes) {
  var layer = {};
  for (var node_id in nodes) {
    var node = Nodes.findOne(node_id);
    var weights = node.needs;
    for (var id in weights) {
      layer[id] = true;
    }
  }
  return layer;
};

//find backward tree (all nodes that are within reach of incoming activation links)
var find_backward_tree = function(node_ids) {
  var tree = [];
  var current_layer = node_ids;
  tree.push(current_layer);
  while (1) {
    var next_layer = find_backward_layer(current_layer);
    if (Object.keys(next_layer).length === 0) {
      break;
    }
    tree.push(next_layer);
    current_layer = next_layer;
  }
  return tree;
};

var find_micronodes = function(node_ids) {
  var micronodes = {};
  var current_layer = node_ids;
  while (1) {
    for (var node_id in current_layer) {
      var node = Nodes.findOne(node_id);
      if (Object.keys(node.needs).length === 0 && node.type == "concept") {
        micronodes[node_id] = true;
      }
    }
    var next_layer = find_backward_layer(current_layer);
    if (Object.keys(next_layer).length === 0) {
      break;
    }
    current_layer = next_layer;
  }
  return micronodes;
};

var find_orb = function(node_ids, user_id) {
  var orb = {};
  for (var node_id in node_ids) {
    var node = Nodes.findOne(node_id);
    //if down is activated add required nodes
    if (node_ids[node_id]) {
      var needs = node.needs;
      for (var id in needs) {
        orb[id] = true;
      }
    }
    //add these anyway
    var granted_by = node.granted_by;
    for (var id in granted_by) {
      orb[id] = true;
    }
    var needed_by = node.needed_by;
    for (var id in needed_by) {
      if (!(id in orb)) {
        orb[id] = true;
      }
    }
  }
  return orb;
};

//encontra toda a região da rede que pode potencialmente afectar positivamente o nodo de objectivo
var find_missing_bush = function(node_ids, user_id) {
  var bush = [];
  var loose = {};
  var origin = {};
  for (var id in node_ids) {
    origin[id] = getState(id, user_id);
  }
  bush.push(origin);
  var bag = node_ids;
  var current_layer = find_orb(node_ids, user_id);
  while (1) {
    bush.push({});
    var to_keep = {};
    for (var id in current_layer) {
      var state = getState(id, user_id);
      var type = Nodes.findOne(id).type;
      //var id_in_bag = typeof bag[id] !== null
      if (type == "content" && !bag[id]) {
        bush[bush.length - 1][id] = state;
        bag[id] = true;
        if (state < STRICT_READY) {
          to_keep[id] = true;
        }
      } else if (type != "content" && !bag[id]) {
        if (state < STRICT_READY) {
          bush[bush.length - 1][id] = state;
          bag[id] = true;
          to_keep[id] = current_layer[id];
        }
        if (type == "concept") {
          var info = Personal.findOne({
            node: id,
            user: user_id
          });
          if (info) {
            loose[id] = info.solidity < 3;
          } else {
            loose[id] = false;
          }
        }
      }
    }
    current_layer = find_orb(to_keep);
    if (Object.keys(bush[bush.length - 1]).length == 0) {
      bush.pop();
    }
    if (Object.keys(current_layer).length == 0) {
      break;
    }
  }
  return {
    "bush": bush,
    "ids": bag,
    "loose": loose
  };
};

var find_adjacent_layer = function(node_ids) {
  var layer = {};
  var forward_layer = find_forward_layer(node_ids);
  for (var id in forward_layer) {
    layer[id] = true;
  }
  var backward_layer = find_backward_layer(node_ids);
  for (var id in backward_layer) {
    layer[id] = true;
  }
  return layer;
};


Meteor.globalFunctions = {
  needsAsJSONSession: function() {
    var nodeId = FlowRouter.getParam('nodeId');
    var neededConceptsInConceptEdit = Meteor.globalFunctions.getNeeds(nodeId);
    if (typeof neededConceptsInConceptEdit !== 'undefined') {
      var needsCrazyObject = neededConceptsInConceptEdit.sets;
      //console.log(needsCrazyObject);
      var needsJSONArray = [];
      for (var setId in needsCrazyObject) {
        var obj = {};
        obj["_id"] = setId;
        obj.contains = [];
        for (var conceptId in needsCrazyObject[setId]) {
          var conceptInfo = Nodes.findOne(conceptId, {
            fields: {
              name: 1,
              description: 1
            }
          });
          obj.contains.push(conceptInfo)
        }
        needsJSONArray.push(obj);
      };
      Session.set('needsObject', needsJSONArray);
    }
  },

  getNeeds: function(nodeId) {
    if (typeof Nodes.findOne(nodeId) !== 'undefined' && Nodes.findOne(nodeId) !== null) {
      var info = {};
      var node = Nodes.findOne(nodeId);
      if(node.type == "content"){
        info.sets = {};
        for (var id in node.needs) {
          var subnode = Nodes.findOne(id);
          if (subnode.isLanguage) {
            info["language"] = id;
          } else if (subnode.type == "or") {
            orId = id;
          }
        }
        if(typeof orId !== "undefined"){
          var or = Nodes.findOne(orId);
          var setIds = or.needs;
          for (var id in setIds) {
            setIds[id] = Nodes.findOne(id).needs;
          }
          info["sets"] = setIds;
        }
      }
      else if(node.type == "concept"){
        info.sets = {};
        var setIds = node.needs;
        for (var id in setIds) {
          setIds[id] = Nodes.findOne(id).needs;
        }
        info["sets"] = setIds;
      }
      else if(node.type == "exam"){
        var languages = {};
        var concepts = {};
        var units = node.needs;
        for(var unit_id in units){
          var needs = Meteor.globalFunctions.getNeeds(unit_id);
          var language_id = needs.language;
          if(language_id){ languages[language_id] = true; }
          for(var set_id in needs.sets){
            for(var concept_id in needs.sets[set_id]){
              concepts[concept_id] = true;
            }
          }
        }
        info.languages = languages;
        info.concepts = concepts;
      }
      return info;
    }
  },

  applySelectizeCode: function() {
    //console.log('applySelectizeCode');
    var conceptsMappedForSelectize = Nodes.find({
      type: 'concept'
    }, {
      fields: {
        _id: 1,
        name: 1,
        description: 1
      }
    }).fetch();
    //console.log(conceptsMappedForSelectize);

    var needsObject = Session.get("needsObject");
    //console.log(needsObject);

    // For each set of concepts, apply selectize js to the respective selectize html
    _.forEach(needsObject, function(nSet) {
      var setId = nSet['_id'];
      //console.log('#' + setId);
      var $select = $('#' + setId).selectize({
        theme: 'links',
        maxItems: null,
        valueField: '_id',
        searchField: ['name', 'description'],
        options: conceptsMappedForSelectize,

        render: {
          option: function(data, escape) {
            return '<div class="option">' +
              '<h5><span class="title"><strong>' + escape(data.name) + '</strong></span><h5>' +
              '<span class="url">' + escape(data.description) + '</span>' +
              '</div>';
          },
          item: function(data, escape) {
            return '<div class="item">' + escape(data.name) + '</div>';
          }
        }
      });

      // For each set of concepts, set the default values
      if (typeof nSet.contains !== 'undefined' && nSet.contains !== null) {
        var subConcepts = nSet.contains;
        console.log(subConcepts);
        _.forEach(subConcepts, function(nSubConcept) {
          if (typeof nSubConcept['_id'] !== 'undefined' && nSubConcept['_id'] !== null) {
            subConceptId = nSubConcept['_id'];
            $('#' + setId).selectize()[0].selectize.addItem(subConceptId);
          }
        })
      };
    });
  },

  getExamContent: function() {
    var examId = FlowRouter.getParam('nodeId');
    var exam = Nodes.findOne({
      _id: examId
    }) || {};
    var examContents = [];
    if (typeof exam.contains != "undefined") {
      var examContentsIDs = exam.contains;
      for (const unitId of examContentsIDs) {
        examContents.push(Nodes.findOne(unitId));
      }
    };
    return examContents;
  },

  getPersonalProperty: function(property, defaultValue, nodeId) {
    var userId = Meteor.userId();
    return getPersonalProperty(property, defaultValue, nodeId, userId);
  },

  getState: function(nodeId) {
    return Meteor.globalFunctions.getPersonalProperty("state", 0, nodeId);
  },

  getSolidity: function(nodeId) {
    return Meteor.globalFunctions.getPersonalProperty("solidity", 0, nodeId);
  },

  isLocked: function(nodeId) {
    return Meteor.globalFunctions.getPersonalProperty("locked", false, nodeId);
  },

  computeState: function(nodeId, assumptions = {}) {
    var userId = Meteor.userId();
    return computeState(nodeId, userId, assumptions);
  },

  //retorna os estados necessários dos nodos afectados pelas alterações
  simulate: function(target) {
    var user_id = Meteor.userId();
    var output_layer = target;
    var input_layer = find_micronodes(output_layer);
    //draw tree
    var tree = find_backward_tree(target);
    //get weights, types and states
    var state = {};
    var needs = {};
    var type = {};
    var locked = {};
    for (var order in tree) {
      var layer = tree[order];
      for (var node_id in layer) {
        state[node_id] = getState(node_id, user_id);
        locked[node_id] = isLocked(node_id, user_id);
        var node = Nodes.findOne(node_id);
        needs[node_id] = {};
        needs[node_id]["weights"] = node.needs;
        needs[node_id]["bias"] = node.bias;
        type[node_id] = node.type;
      }
    }
    //make sure everything is up to date
    for (var order = tree.length - 2; order >= 0; order--) {
      var layer = tree[order];
      for (var node_id in layer) {
        var weights = needs[node_id].weights;
        if (Object.keys(weights).length == 0) {
          continue;
        }
        var arg = needs[node_id].bias;
        for (var subnode_id in weights) {
          arg += weights[subnode_id] * state[subnode_id];
        }
        state[node_id] = sigmoid(arg);
        //if( output_layer[node_id] != null ){ max_states[node_id] = state[node_id]; }
      }
    }
    //compute maximum activations
    //increment input states
    var max_state = {};
    for (var node_id in state) {
      max_state[node_id] = state[node_id];
    }
    for (var node_id in input_layer) {
      //if( !locked[node_id] ){ state[node_id] = 1; }
      max_state[node_id] = 1;
    }
    //forward propagate
    for (var order = tree.length - 2; order >= 0; order--) {
      var layer = tree[order];
      for (var node_id in layer) {
        var weights = needs[node_id].weights;
        if (Object.keys(weights).length == 0) {
          continue;
        }
        var arg = needs[node_id].bias;
        for (var subnode_id in weights) {
          arg += weights[subnode_id] * max_state[subnode_id];
        }
        max_state[node_id] = sigmoid(arg);
        //if( output_layer[node_id] != null ){ max_states[node_id] = state[node_id]; }
      }
    }
    //compute minimum activations
    //decrement input states
    var min_state = {};
    for (var node_id in state) {
      min_state[node_id] = state[node_id];
    }
    for (var node_id in input_layer) {
      if (!locked[node_id]) {
        min_state[node_id] = 0;
      }
    }
    //forward propagate
    for (var order = tree.length - 2; order >= 0; order--) {
      var layer = tree[order];
      for (var node_id in layer) {
        var weights = needs[node_id].weights;
        if (Object.keys(weights).length == 0) {
          continue;
        }
        var arg = needs[node_id].bias;
        for (var subnode_id in weights) {
          arg += weights[subnode_id] * min_state[subnode_id];
        }
        min_state[node_id] = sigmoid(arg);
        //if( output_layer[node_id] != null ){ min_states[node_id] = state[node_id]; }
      }
    }
    //update the target to realistic values
    for (node_id in target) {
      target[node_id] = target[node_id] ? max_state[node_id] : min_state[node_id];
    }
    //define maxmimum and minimum variations
    var max_dist = 0;
    for (node_id in target) {
      var dist = Math.abs(target[node_id] - state[node_id]);
      max_dist = max_dist < dist ? dist : max_dist;
    }
    var MAX_VAR = max_dist / MIN_STEPS;
    var MIN_VAR = max_dist / MAX_STEPS;
    //define target layer errors, save current output states and compute total error
    var saved_output = {};
    var error = {};
    var max_error = 0;
    //update target micronode states
    for (var node_id in target) {
      //var node = Nodes.findOne(node_id);
      if (Object.keys(needs[node_id].weights).length == 0) {
        state[node_id] = target[node_id];
      }
    }
    //initialize all error entries
    for (var i in tree) {
      var layer = tree[i];
      for (node_id in layer) {
        if (node_id in target) {
          saved_output[node_id] = state[node_id];
          var delta = (target[node_id] - state[node_id]);
          error[node_id] = locked[node_id] ? cut_negative(delta) : delta;
          max_error = Math.abs(target[node_id] - state[node_id]) > max_error ? Math.abs(target[node_id] - state[node_id]) : max_error;
        } else {
          error[node_id] = 0;
        }
      }
    }
    //save current input states
    saved_input = {};
    for (node_id in input_layer) {
      saved_input[node_id] = state[node_id];
    }
    //begin subnetwork update
    while (max_error > TOLERANCE) {
      //reset bounds
      var is_top_set = false;
      var is_bottom_set = false;
      var upper_bound = Math.pow(10, 10);
      var lower_bound = 0;
      //backpropagation
      for (order in tree) {
        layer = tree[order];
        for (node_id in layer) {
          weights = needs[node_id].weights;
          if (Object.keys(weights).length == 0) {
            continue;
          }
          for (var subnode_id in weights) {
            var weight = weights[subnode_id];
            delta = error[node_id] * weight * state[node_id] * (1 - state[node_id]);
            error[subnode_id] += locked[subnode_id] ? cut_negative(delta) : delta;
            var subnode = Nodes.findOne(subnode_id);
          }
        }
      }
      //forward propagation
      while (true) {
        //increment input states
        for (var node_id in input_layer) {
          state[node_id] = box(state[node_id] + RATE * error[node_id]);
        }
        //forward propagate
        for (var order = tree.length - 2; order >= 0; order--) {
          var layer = tree[order];
          for (var node_id in layer) {
            var weights = needs[node_id].weights;
            if (Object.keys(weights).length == 0) {
              continue;
            }
            var arg = needs[node_id].bias;
            for (var subnode_id in weights) {
              arg += weights[subnode_id] * state[subnode_id];
            }
            state[node_id] = sigmoid(arg);
          }
        }
        //compute maximum variations of output states
        var max_variation = 0;
        for (var node_id in output_layer) {
          var variation = Math.abs(state[node_id] - saved_output[node_id]);
          max_variation = variation > max_variation ? variation : max_variation;
        }
        //compute step quality
        var high = max_variation > MAX_VAR;
        var low = max_variation < MIN_VAR;
        //if it's OK, carry on
        if (!high && !low) {
          break;
        }
        //if it's not OK, enhance step size and repeat
        else if (high) {
          var max = RATE;
          is_top_set = true;
          upper_bound = RATE;
          RATE = is_bottom_set ? (upper_bound + lower_bound) / 2 : RATE / 2;
          //reset input
          for (var node_id in input_layer) {
            state[node_id] = saved_input[node_id];
          }
          //continue;
          //if it's both high and low treat as if it were just high
        } else if (low) {
          var min = RATE;
          is_bottom_set = true;
          lower_bound = RATE;
          RATE = is_top_set ? (upper_bound + lower_bound) / 2. : RATE * 2;
          //reset input
          for (var node_id in input_layer) {
            state[node_id] = saved_input[node_id];
          }
          //continue;
        }
      }
      //end of forward propagation
      //define target layer errors, save output states and compute total error
      max_error = 0;
      for (var node_id in target) {
        saved_output[node_id] = state[node_id];
        error[node_id] = state[node_id] * (1 - state[node_id]) * (target[node_id] - state[node_id]);
        max_error = Math.abs(target[node_id] - state[node_id]) > max_error ? Math.abs(target[node_id] - state[node_id]) : max_error;
      }
      //save current input
      for (var node_id in input_layer) {
        saved_input[node_id] = state[node_id];
      }
    }
    //end of subnetwork update
    tree = find_forward_tree(input_layer);
    for (var order = 1; order < tree.length; order++) {
      var layer = tree[order];
      for (var node_id in layer) {
        if (typeof state[node_id] === "undefined") {
          var node = Nodes.findOne(node_id);
          needs[node_id] = {};
          needs[node_id].weights = node.needs;
          needs[node_id].bias = node.bias;
          type[node_id] = node.type;
        }
        var weights = needs[node_id].weights;
        var arg = needs[node_id].bias;
        if (Object.keys(weights).length == 0) {
          continue;
        }
        for (var subnode_id in weights) {
          arg += weights[subnode_id] * (state[subnode_id] != null ? state[subnode_id] : getState(subnode_id, user_id));
        }
        state[node_id] = sigmoid(arg);
      }
    }
    return state;

  },

  //pré-calcula os novos estados
  precompute: function(unit_id) {
    var user_id = Meteor.userId();
    var result = {};
    var target = {};
    target[unit_id] = true;
    if (typeof Nodes.findOne(unit_id) !== 'undefined' && Nodes.findOne(unit_id) !== null) {
      var grants = Nodes.findOne(unit_id).grants;
      if (grants) {
        for (var id in grants) {
          target[id] = true;
        }
      }
      result["success"] = Meteor.globalFunctions.simulate(target);
      target = {};
      target[unit_id] = false;
      result["failure"] = Meteor.globalFunctions.simulate(target);
      return result;
    }
  },

  //fazer uma versão desta função para ser précalculada enquanto o utilizador faz a unidade
  findUsefulContent: function(node_ids, not_in = {}) {
    var user_id = Meteor.userId();
    var find = find_missing_bush(node_ids, user_id);
    var bush = find.bush;
    var ids = find["ids"];
    var loose = find.loose;
    for (var id in loose) {
      if (loose[id]) {
        //find two units to test this concept in success and in failure
        tests = Meteor.globalFunctions.testingUnit(id);
        if (tests.failure) {
          return tests.failure;
        }
      }
    }
    for (var n in bush) {
      var layer = bush[n];
      for (var id in layer) {
        var node = Nodes.findOne(id);
        var state = getState(id, user_id);
        if (node.type == "content" && state > READY && typeof not_in[id] === "undefined") {
          var target = {};
          target[id] = true;
          for (var granted_id in node.grants) {
            target[granted_id] = true;
          }
          var simulation = Meteor.globalFunctions.simulate(target);
          for (var altered_id in simulation) {
            var change = simulation[altered_id] - getState(altered_id);
            var is_in_bush = ids[altered_id];
            if (change > SOLIDITY_TOLERANCE && is_in_bush) {
              return id;
            }
          }
        }
      }
    }
  },

  //retorna a primeira unidade que testa um determinado conceito
  testingUnit: function(concept_id) {
    var user_id = Meteor.userId();
    var tests = {};
    var layer = {};
    layer[concept_id] = true;
    var visited = {};
    visited[concept_id] = true;
    var found_success = false;
    var found_failure = false;
    var concept_state = getState(concept_id, user_id);
    while (Object.keys(layer).length > 0) {
      layer = find_adjacent_layer(layer);
      for (var id in layer) {
        //retirar se já tiver sido visitado
        if (visited[id]) {
          delete layer[id];
          continue;
        }
        visited[id] = true;
        var node = Nodes.findOne(id);
        var type = node.type;
        var state = getState(id, user_id);
        if (node.isUnitFromModule) {
          continue;
        } //ALT1: ALTERAR ESTA LINHA PARA SUGERIR O EXAME EM VEZ DE DESCARTAR
        if (node.type == "content" && state > READY) {
          var simulation = Meteor.globalFunctions.precompute(id);
          var success_variation = simulation.success[concept_id] - concept_state;
          var failure_variation = simulation.failure[concept_id] - concept_state;
          if (Math.abs(success_variation) > SOLIDITY_TOLERANCE) {
            tests.success = id;
            found_success = true;
          }
          if (Math.abs(failure_variation) > SOLIDITY_TOLERANCE) {
            tests.failure = id;
            found_failure = true;
          }
          if (found_success && found_failure) {
            return tests;
          }
        }
      }
    }
    return tests;
  }


}
