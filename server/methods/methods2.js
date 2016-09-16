//math functions
sigmoid = function(x) {
    return 1.0 / (1 + Math.exp(-x));
};

inverseSigmoid = function(x) {
    return -Math.log(x / (1 - x));
};

box = function(x) {
    return x > 1 ? 1 : (x < 0 ? 0 : x);
};

cut_negative = function(x) {
    return x >= 0 ? x : 0;
};

//ARG_READY = 2.5;
//ARG_NOT_READY = -5;
WIDTH = 10;//ARG_READY - ARG_NOT_READY;
DEFAULT_BIAS = -WIDTH/2;

var RATE = 0.1;
var ADJUSTMENT = 2.;
var MAX_STEPS = 10000;
var MIN_STEPS = 100;
var TOLERANCE = 0.01;

var SOLIDITY_TOLERANCE = 0.09;
READY = 0.5;
NOT_READY = 0.5;

is_in_array = function(array,value){
    return array.indexOf(value) > 0;
}

remove_ocurrences_from_array = function(array,value){
    while(true){
      var i = array.indexOf(value);
      if(i < 0){ return array; }
      array.splice(i,1);
    }
}

replace_ocurrences_in_array = function(array,old_value,new_value){
    if(old_value == new_value){ return array; }
    while(true){
      var i = array.indexOf(old_value);
      if(i < 0){ return array; }
      array.splice(i,1,new_value);
    }
}

compute_weights = function(concepts,operator) {
    var weights = {};
    if(Object.keys(concepts).length == 0) {
        var bias = -DEFAULT_BIAS;//ARG_READY;
    }
    //aceso se qualquer um dos requesitos estiver activado
    else if(operator == "or"){
        var bias = DEFAULT_BIAS;//ARG_NOT_READY;
        for (var id in concepts) {
            weights[id] = WIDTH;
        }
    }
    //aceso se todos os requesitos estiverem activados
    else if(operator == "and"){
        //definição estricta
        var bias = -DEFAULT_BIAS*(1-2*Object.keys(concepts).length);//ARG_READY - WIDTH*Object.keys(concepts).length;
        for (var id in concepts) {
            weights[id] = WIDTH;
        }
        //definição relaxada
        /*var bias = BIAS;//ARG_NOT_READY;
        for (var id in concepts) {
            weights[id] = WIDTH/Object.keys(concepts).length;
        }*/
    }
    //aceso se todos os requesitos menos um estiverem activados
    else if(operator == "parand"){
        //definição estricta
        var bias = -DEFAULT_BIAS*(3-2*Object.keys(concepts).length);//ARG_READY - WIDTH*(Object.keys(concepts).length-1);
        for (var id in concepts) {
            weights[id] = WIDTH;
        }
        //definição relaxada
        /*var bias = ARG_NOT_READY;
        for (var id in concepts) {
            weights[id] = WIDTH/(Object.keys(concepts).length-1);
        }*/
    }
    return {
        weights: weights,
        bias: bias
    };
};

set_personal_property = function(property, value, node_id, user_id) {
    var info = Personal.findOne({
        user: user_id,
        node: node_id
    });
    if (info) {
        var update = {};
        update[property] = value;
        Personal.update({
          _id: info._id
        },{
          $set: update
        });
    } else {
        var insert = {
          user: user_id,
          node: node_id
        };
        insert[property] = value;
        Personal.insert(insert);
    }
};

get_personal_property = function(property, default_value, node_id, user_id) {
  var node = Nodes.findOne({
      _id: node_id
  });
  var info = Personal.findOne({
      user: user_id,
      node: node_id
  });
  return info ? (info[property] ? info[property] : default_value) : default_value;
};

set_state = function(value,node_id,user_id) {
    return set_personal_property("state",value,node_id,user_id);
};

get_state = function(node_id,user_id) {
    return get_personal_property("state",0,node_id,user_id);
};

set_solidity = function(value,node_id,user_id) {
    return set_personal_property("solidity",value,node_id,user_id);
};

get_solidity = function(node_id,user_id) {
    return get_personal_property("solidity",0,node_id,user_id);
};

lock_state = function(node_id,user_id) {
    set_personal_property("locked",true,node_id,user_id);
};

unlock_state = function(node_id,user_id) {
    set_personal_property("locked",false,node_id,user_id);
};

is_locked = function(node_id,user_id) {
    return get_personal_property("locked",false,node_id,user_id);
}

set_SS = function(value,node_id,user_id) {
    var state = get_state(node_id,user_id);
    if( Math.abs(value - state) < 0.1 ){ //se a variação for insignificante aumentar a solidez
      var solidity = get_solidity(node_id,user_id);
      set_personal_property("solidity",solidity+1,node_id,user_id);
    }
    else{ //se a variação for significativa, reduzir a solidez
      set_personal_property("solidity",solidity-1,node_id,user_id);
    }
    set_personal_property("state",value,node_id,user_id);
};

compute_state = function(node_id, user_id, update=false) {
    var node = Nodes.findOne(node_id);
    var type = node.type;
    if(type == "exam"){
        var contains = node.contains;
        var norm = contains.length;
        var score = 0;
        var id;
        for(var i in contains) {
          id = contains[i];
          score += get_state(id, user_id);
        }
        return score / norm;
    }
    else {
      var state;
      var weights = node.needs;
      var bias = node.bias;
      //if it's a microconcept, return its current state
      if (Object.keys(weights).length === 0) {
          if (node.type == "concept") {
              state = get_state(node_id, user_id);
          } else if (node.type == "content") {
              state = 1;
          }
      }
      else{
          var arg = bias;
          for(id in weights){
              arg += weights[id]*get_state(id,user_id);
          }
          state = sigmoid(arg);
      }
      //if update is true then write this value to the database
      if(update){ set_state(state, node_id, user_id); }
      return state;
    }
};

reset_user = function(user_id) {
    Personal.remove({
        user: user_id
    });
    var zeroth_level = Nodes.find({
        type: "content",
        "needs": {}
    }).fetch();
    for (var i in zeroth_level) {
        var node = zeroth_level[i];
        update_state(node._id, user_id);
    }
};

//todos os nodos acessíveis por um grau de needed_by ou contained_in
find_forward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        var needed_by = node.needed_by;
        for (var id in needed_by) {
          layer[id] = true;
        }
        var contained_in = node.contained_in;
        for (var id in contained_in) {
          layer[id] = true;
        }
    }
    return layer;
};
//A-OK

//find forward tree (all nodes that are within reach of outgoing activation links)
find_forward_tree = function(node_ids) {
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

//sum of all the needed_by
find_full_forward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        var needed_by = node.needed_by;
        for (var id in needed_by) {
          layer[id] = true;
        }
        var grants = node.grants;
        for (var id in grants) {
          layer[id] = true;
        }
    }
    return layer;
};

//find forward tree (all nodes that are within reach of outgoing activation links)
find_full_forward_tree = function(node_ids) {
    var tree = [];
    var current_layer = node_ids;
    tree.push(current_layer);
    while (1) {
        var next_layer = find_full_forward_layer(current_layer);
        if (Object.keys(next_layer).length === 0) {
            break;
        }
        tree.push(next_layer);
        current_layer = next_layer;
    }
    return tree;
};

//todos os nodos acessíveis por needs ou contains
find_backward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        var weights = node.needs;
        for (var id in weights) {
            layer[id] = true;
        }
        var contains = node.contains;
        for (var i in contains) {
            var id = contains[i];
            layer[id] = true;
        }
    }
    return layer;
};
//A-OK

find_full_backward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        var weights = node.needs;
        for (var id in weights) {
            layer[id] = true;
        }
        var granted_by = node.granted_by;
        for (var id in granted_by) {
            layer[id] = true;
        }
    }
    return layer;
};

//find backward tree (all nodes that are within reach of incoming activation links)
find_backward_tree = function(node_ids) {
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


//find backward tree (all nodes that are within reach of incoming activation links)
find_full_backward_tree = function(node_ids) {
    var tree = [];
    var current_layer = node_ids;
    tree.push(current_layer);
    while (1) {
        var next_layer = find_full_backward_layer(current_layer);
        if (Object.keys(next_layer).length === 0) {
            break;
        }
        tree.push(next_layer);
        current_layer = next_layer;
    }
    return tree;
};

find_missing_subtree = function(node_ids,user_id) {
    var tree = [];
    var bag = {};
    var current_layer = node_ids;
    while(1){
        tree.push({});
        var to_keep = {};
        for(var node_id in current_layer){
            var state = get_state(node_id,user_id);
            var type = Nodes.findOne(node_id).type;
            if( type == "content" && !(node_id in bag) ){
                tree[tree.length-1][node_id] = state;
                bag[node_id] = true;
                if( state < READY ){ to_keep[node_id] = true; }
            }
            else if( type == "concept" && state < READY && !(node_id in bag) ){
                tree[tree.length-1][node_id] = state;
                bag[node_id] = true;
                to_keep[node_id] = true;
            }
            else if( ( type == "and" || type == "or" || type == "parand" ) && state < READY && !(node_id in bag) ){
                //tree[tree.length-1][node_id] = state;
                bag[node_id] = true;
                to_keep[node_id] = true;
            }
        }
        current_layer = find_full_backward_layer(to_keep);
        if( Object.keys(current_layer).length === 0 ){ break; }
    }
    return tree;
};

//retorna todos os nodos acessíveis por um grau de needs, needed_by, contained_in ou contains
find_adjacent_nodes = function(node_ids){
    var adjacent_nodes = {};
    var backward_layer = find_backward_layer(node_ids);
    var forward_layer = find_forward_layer(node_ids);
    for(var id in backward_layer){
        adjacent_nodes[id] = true;
    }
    for(var id in forward_layer){
        adjacent_nodes[id] = true;
    }
    return adjacent_nodes;
}

find_wake_orb = function(node_ids){
    var orb = [];
    var visited = {};
    var layer = {};
    for(var id in node_ids){ layer[id] = true; }
    while( Object.keys(layer).length != 0 ){
        var to_keep = {}; //lista de nodos cujos adjacentes passarão ao passo seguinte
        for(var id in layer){
            if( visited[id] != null ){ delete layer[id]; } //se já tiver sido visitado ignorá-lo
            else if( Nodes.findOne(id).type != "content" ){ //só guardar para o passo seguinte se não for um conteúdo
                to_keep[id] = true;
            }
            visited[id] = true; //marcar como visitado
        }
        if( Object.keys(layer).length != 0 ){ orb.push(layer); } //guardar esta camada incluindo os conteúdos
        layer = find_adjacent_nodes(to_keep); //proseguir sem os vizinhos dos nodos de conteúdo
    }
    return orb;
}

find_adjacent_layer = function(node_ids){
    var layer = {};
    var forward_layer = find_forward_layer(node_ids);
    for(var id in forward_layer){ layer[id] = true; }
    var backward_layer = find_backward_layer(node_ids);
    for(var id in backward_layer){ layer[id] = true; }
    return layer;
}

//retorna a primeira unidade que testa um determinado conceito
testing_unit = function(concept_id,user_id){
    var tests = {};
    var layer = {}; layer[concept_id] = true;
    var visited = {}; visited[concept_id] = true;
    var found_success = false;
    var found_failure = false;
    var concept_state = get_state(concept_id,user_id);
    while( Object.keys(layer).length > 0 ){
        layer = find_adjacent_layer(layer);
        for(var id in layer){
            //retirar se já tiver sido visitado
            if(visited[id]){
              delete layer[id];
              continue;
            }
            visited[id] = true;
            var node = Nodes.findOne(id);
            var type = node.type;
            var state = get_state(id,user_id);
            if(node.isUnitFromModule){ continue; } //ALT1: ALTERAR ESTA LINHA PARA SUGERIR O EXAME EM VEZ DE DESCARTAR
            if(node.type == "content" && state > READY){
                var simulation = precompute(id,user_id);
                var success_variation = simulation.success[concept_id] - concept_state;
                var failure_variation = simulation.failure[concept_id] - concept_state;
                if(Math.abs(success_variation) > SOLIDITY_TOLERANCE){
                  tests.success = id;
                  found_success = true;
                }
                if(Math.abs(failure_variation) > SOLIDITY_TOLERANCE){
                  tests.failure = id;
                  found_failure = true;
                }
                if( found_success&&found_failure ){
                    return tests;
                }
            }
        }
    }
    return tests;
}

//creation functions
create_content = function(parameters) {
    var id = Nodes.insert({
        type: "content",
        created_on: Date.now(),
        name: "",
        description: "",
        content: [],
        needs: {},
        requirements: {},
        language: null,
        grants: {},
        contained_in: {},
        authors: {},
        likes: 0,
        dislikes: 0,
        successes: 0,
        attempts: 0
    });
    if (!_.isEmpty(parameters)) {
        Nodes.update({
            _id: id
        }, {
            $set: parameters
        });
    }
    var users = Meteor.users.find().fetch();
    for (var i in users) {
        var user_id = users[i]._id;
        set_state(1, id, user_id);
        //set_completion(1, id, user_id);
    }
    return id;
};

create_concept = function(parameters) {
    var id = Nodes.insert({
        type: "concept",
        created_on: Date.now(),
        name: "",
        description: "",
        granted_by: {},
        needed_by: {},
        needs: {},
        requirements: {},
        authors: {}
    });
    if (!_.isEmpty(parameters)) {
        Nodes.update({
            _id: id
        }, {
            $set: parameters
        });
    }
    var users = Meteor.users.find().fetch();
    for (var i in users) {
        var user_id = users[i]._id;
        set_state(0, id, user_id);
        //set_completion(0, id, user_id);
    }
    return id;
};

create_exam = function(parameters) {
    var id = Nodes.insert({
        type: "exam",
        created_on: Date.now(),
        name: "",
        description: "",
        contains: [],
        authors: {},
        likes: 0,
        dislikes: 0,
        successes: 0,
        attempts: 0
    });
    if (!_.isEmpty(parameters)) {
        Nodes.update({
            _id: id
        }, {
            $set: parameters
        });
    }
    var users = Meteor.users.find().fetch();
    for (var i in users) {
        var user_id = users[i]._id;
        set_state(1, id, user_id);
        //set_completion(1, id, user_id);
    }
    return id;
};

full_create = function(p) {
    if (p.type == "concept") {
        var id = create_concept(p.parameters);
        var needs = p.needs;
        if(needs){ add_needs(id, needs); }
    } else if (p.type == "content") {
        var id = create_content(p.parameters);
        var grants = p.grants;
        if(grants){ add_grants(id, grants); }
        var needs = p.needs;
        if(needs){ add_needs(id, needs); }
    } else if (p.type == "exam") {
        var id = create_exam(p.parameters);
        var contains = p.contains;
        if(contains){ add_contains(id, contains); }
    }
    var users = Meteor.users.find().fetch();
    for (var i in users){
      var user_id = users[i]._id;
      update_state(id,user_id);
      if(p.type != "exam") {
        var fwd = {};
        fwd[id] = true;
        forward_update(fwd,user_id);
      }
    }
    return id;
};

create_gate = function(operator) {
    var id = Nodes.insert({
        type: operator,
        created_on: Date.now(),
        needed_by: {},
        needs: {}
    });
    var users = Meteor.users.find().fetch();
    for (var i in users) {
        var user_id = users[i]._id;
        set_state(0, id, user_id);
        //set_completion(0, id, user_id);
    }
    return id;
};

add_author = function(node_id,author_id){
    var authors = Nodes.findOne(node_id).authors;
    authors[author_id] = true;
    Nodes.update({_id: node_id},{$set: {authors: authors}});
    var works = Meteor.users.findOne(author_id).works;
    works[node_id] = true;
    Meteor.users.update({_id: author_id},{$set: {works: works}});
}

remove_author = function(node_id,author_id){
    var authors = Nodes.findOne(node_id).authors;
    delete authors[author_id];
    Nodes.update({_id: node_id},{$set: {authors: authors}});
    var works = Meteor.users.findOne(author_id).works;
    delete works[node_id];
    Meteor.users.update({
        _id: author_id
    },{
        $set: {works: works}}
    );
}

add_grants = function(node_id,concepts){
    var update = {grants: concepts};
    Nodes.update({_id: node_id},{
        $set: update
    });
    for (var id in concepts) {
        var granted_by = Nodes.findOne(id).granted_by;
        granted_by[node_id] = true;
        update = {
            granted_by: granted_by
        };
        Nodes.update({
            _id: id
        }, {
            $set: update
        });
    }
}

edit_grants = function(node_id,new_grants){
    var old_grants = Nodes.findOne(node_id).grants;
    for(var id in old_grants){
      if(!new_grants[id]){
        remove_from_field(id,"granted_by",node_id);
      }
    }
    for(var id in new_grants){
      add_to_field(id,"granted_by",node_id,true);
    }
    Nodes.update({_id: node_id},{ $set: {grants: new_grants} });
};

add_contains = function(exam_id,exercises){
    var update = {contains: exercises};
    Nodes.update({_id: exam_id},{
        $set: update
    });
    for (var i in exercises) {
        var id = exercises[i];
        var contained_in = Nodes.findOne(id).contained_in;
        contained_in[exam_id] = true;
        update = {
            contained_in: contained_in
        };
        Nodes.update({
            _id: id
        }, {
            $set: update
        });
    }
}

edit_contains = function(exam_id,new_contains){
    var old_contains = Nodes.findOne(exam_id).contains;
    var id;
    var contained_in;
    for(var i in old_contains){
      id = old_contains[i];
      if(!is_in_array(new_contains,id)){
        contained_in = Nodes.findOne(id).contained_in;
        delete contained_in[exam_id];
        Nodes.update({
            _id: id
        }, {
            $set: { contained_in: contained_in }
        });
      }
    }
    for(var i in new_contains){
      id = new_contains[i];
      var contained_in = Nodes.findOne(id).contained_in;
      contained_in[exam_id] = i;
      Nodes.update({
          _id: id
      }, {
          $set: { contained_in: contained_in }
      });
    }
    Nodes.update({_id: exam_id},{ $set: {contains: new_contains} });
};

remove_exam = function(exam_id){
    edit_contains(exam_id,[]);
    Nodes.remove(exam_id);
}

//cria as ligações aos subnodos
make_connector = function(subnodes,operator){
    var sublinks = compute_weights(subnodes,operator);
    var weights = sublinks.weights;
    var bias = sublinks.bias;
    var node_id = create_gate(operator);
    //requesitos da porta
    Nodes.update({
      _id: node_id
    },{
      $set: {needs: weights, bias: bias}
    });
    //ligações correspondentes nos subnodos
    for(var id in subnodes){
      var needed_by = Nodes.findOne(id).needed_by;
      needed_by[node_id] = true;
      Nodes.update({
          _id: id
        },{
          $set: {needed_by: needed_by}
      });
    }
    return node_id;
};

/*makes the connections from a node (concept or content) to its needs from an object like
    {
      "language": id,
      "concepts":[
                  {id:true,id:true},
                  {id:true,id:true,id:true}
                ]
    }*/
add_needs = function(node_id,needs){
    var node = Nodes.findOne(node_id);
    var type = node.type;
    if(type == "or" || type == "and" || type == "parand"){
        return "error";//ERROR
    }
    else if(type == "concept"){
        //o próprio nodo de conceito é uma porta OR que agrupa os diferentes ANDs dos pré-requesitos
        var subands = {};
        for(var i = 0; i < needs.concepts.length; i++){
            var and_id = make_connector(needs.concepts[i],"and");
            subands[and_id] = true;
            var needed_by = Nodes.findOne(and_id).needed_by;
            needed_by[node_id] = true;
            Nodes.update({_id:and_id},{$set:
              {needed_by: needed_by}
            });
        }
        //var or_id = make_connector(subands,"or");
        var sublinks = compute_weights(subands,"or");
        Nodes.update({_id:node_id},{$set:
          {needs: sublinks.weights, bias:sublinks.bias, requirements: or_id}
        });
    }
    else if(type == "content"){
        //há pré-requesitos conceptuais ou linguísticos?
        var needs_language = needs.language != null;
        var needs_concepts = needs.concepts.length > 0;
        //a unidade é uma porta AND que liga ao OR dos requesitos e à língua
        var and = {};
        //criar porta OR que agrupe os diferentes ANDs dos pré-requesitos
        var subands = {};
        for(var i = 0; i < needs.concepts.length; i++){
            var id = make_connector(needs.concepts[i],"and");
            subands[id] = true;
        }
        //se houver conjuntos ligar à porta OR
        if(needs_concepts){
            var or_id = make_connector(subands,"or");
            and[or_id] = true;
        }
        else{ or_id = null; }
        //se houver língua ligar à língua
        if(needs_language){
          var language_id = needs.language;
          and[language_id] = true;
        }
        else{ language_id = null; }
        //var and_id = make_connector(and,"and");
        var sublinks = compute_weights(and,"and");
        Nodes.update({_id:node_id},{$set:
          {needs: sublinks.weights, bias:sublinks.bias, language: language_id, requirements: or_id}
        });
        //fazer as referências a este nodo nos subnodos (língua e OR)
        for(var id in sublinks.weights){
          var needed_by = Nodes.findOne(id).needed_by;
          needed_by[node_id] = true;
          Nodes.update({_id:id},{$set:
            {needed_by: needed_by}
          });
        }
    }
};

//nesta função falta apagar os subnodos lógicos (ANDs e ORs) que já não são necessários
remove_node = function(node_id){
    var node = Nodes.findOne(node_id);
    var type = node.type;
    //apagar os subconjuntos todos deste nodo; desta forma as portas OR e AND são apagadas também
    if(node.type == "content" || node.type == "concept"){
      var prerequisites = get_needs(node_id);
      var requirements = prerequisites.sets;
      var language = prerequisites.language;
      for(var and_id in requirements){
        edit_requirement(and_id,{});
      }
      if(language){ change_language_requisite(node_id,null); }
    }
    //remover referências a este nodo em subnodos (válido para qualquer tipo de nodo)
    var needs = node.needs;
    var other;
    for(var id in needs){
        other = Nodes.findOne(id).needed_by;
        if(other){
          delete other[node_id];
          Nodes.update({_id: node_id},{$set:
            {needed_by: other}
          });
        }
    }
    //se for um conteúdo apagar a sua referência nos conceitos que ele confere
    if(node.type == "content"){
        var grants = node.grants;
        for(var id in grants){
            other = Nodes.findOne(id).granted_by;
            delete other[node_id];
            Nodes.update({_id: node_id},{$set:
              {granted_by: other}
            });
        }
    }
    //se for um conceitos ou um porta lógica
    else{
        //se for um conceito apagar a sua referência nos conteúdos que o conferem
        if(node.type == "concept"){
            var granted_by = node.granted_by;
            for(var id in granted_by){
                other = Nodes.findOne(id).grants;
                delete other[node_id];
                Nodes.update({_id: node_id},{$set:
                  {grants: other}
                });
            }
        }
        //apagar a sua referência nos nodos que precisam deste nodo
        var needed_by = node.needed_by;
        for(var id in needed_by){
            other = Nodes.findOne(id).needs;
            delete other[node_id];
            Nodes.update({_id: id},{$set:
              {needs: other}
            });
        }
    }
    //por fim remover o nodo
    Nodes.remove(node_id);
}

//muda o nome, descrição, etc... duma lição
edit_node_info = function(node_id,parameters){
    Nodes.update({_id:node_id},{$set:parameters});
}

//muda a língua dum conteúdo
change_language_requisite = function(content_id,new_language_id){
    var content = Nodes.findOne(content_id);
    //requesitos actuais (um para língua e um para OR)
    var needs = content.needs;
    //tratar da língua anterior
    var needs_info = get_needs(content_id);
    var old_language_id = needs_info.language;
    var needed_language = old_language_id != null;
    //se havia já um pré-requesito linguístico
    if(needed_language){
      //apagar a sua referência no nodo da língua
      var old_language = Nodes.findOne(old_language_id);
      var other = old_language.needed_by;
      delete other[content_id];
      Nodes.update({_id:old_language_id},{$set:{needed_by:other}});
      //apagar a referência à língua no objecto temporário de requesitos
      delete needs[old_language_id];
    }
    //tratar da nova língua
    var new_language = Nodes.findOne(new_language_id);
    var needs_language = new_language_id != null;
    //se ele precisar de pré-requesitos linguísticos
    if(needs_language){
      //meter a referência no nodo da nova língua
      other = new_language.needed_by;
      other[content_id] = true;
      Nodes.update({_id:new_language_id},{$set:{needed_by:other}});
      //adicionar a nova língua ao objecto temporário de requesitos
      needs[new_language_id] = true;
    }
    //recalcular os pesos da unidade e actualizar na base de dados
    var sublinks = compute_weights(needs,"and");
    Nodes.update({_id:content_id},{$set:{
      needs: sublinks.weights,
      bias: sublinks.bias
    }});
}
//A-OK

//retira um elemento de um objecto dentro dum nodo
remove_from_field = function(node_id, field_name, key){
    var object = Nodes.findOne(node_id)[field_name];
    delete object[key];
    var update = {};
    update[field_name] = object;
    Nodes.update(node_id,{$set:update});
}
//A-OK

//modifica um elemento de um objecto dentro dum nodo
add_to_field = function(node_id, field_name, key, value){
    var object = Nodes.findOne(node_id)[field_name];
    object[key] = value;
    var update = {};
    update[field_name] = object;
    Nodes.update(node_id,{$set:update});
}
//A-OK

//modifica um dos conjuntos de requesitos
edit_requirement = function(and_id,new_concepts){
    var and = Nodes.findOne(and_id);
    var dropped_concepts = {};
    var inserted_concepts = {};
    var old_concepts = and.needs;
    //encontrar os conceitos abandonados e retirar as suas referências correspondentes
    for(var id in old_concepts){
        var concept = Nodes.findOne(id);
        if(!new_concepts[id]){
            remove_from_field(id,"needed_by",and_id);
        }
    }
    var weights = compute_weights(new_concepts,"and");
    var needs = weights.weights;
    var bias = weights.bias;
    Nodes.update({_id:and_id},{$set:
      { needs: needs, bias: bias }
    });
    for(var id in new_concepts){
        var concept = Nodes.findOne(id);
        add_to_field(id,"needed_by",and_id,true);
    }
    //apagar o nodo AND do conjunto se ele ficar sem subconceitos
    if(Object.keys(new_concepts).length == 0){
        // o nodo que precisa deste conjunto (que será sempre um OR,
        //    um conceito ou um conteúdo mas cuja lógica será sempre do tipo OR)
        var node_id = Object.keys(and.needed_by)[0];
        //apagar o nodo, o que vai também apagar a sua referência no sobrenodo
        remove_node(and_id);
        var node = Nodes.findOne(node_id);
        needs = node.needs;
        //recalcular os pesos para dar uma porta OR
        weights = compute_weights(needs,"or");
        needs = weights.weights;
        bias = weights.bias;
        //se o OR ficar vazio apagá-lo também e concluir saindo da função
        var or_is_empty = Object.keys(needs).length == 0;
        var is_an_or_gate = node.type == "or";
        if(or_is_empty && is_an_or_gate){
          Nodes.update(Object.keys(node.needed_by)[0],{$set: {requirements:null}});
          remove_node(node_id);
          return true;
        }
        //senão reinserir esses novos pesos no OR
        Nodes.update({_id:node_id},{$set:{needs:needs,bias:bias}});
    }
}

//adiciona um conjunto de requesitos conceptuais a um nodo já existente
add_requirement = function(node_id, concepts){
    var node = Nodes.findOne(node_id);
    //criar o AND do conjunto
    var and_id = make_connector(concepts,"and");
    var and = Nodes.findOne(and_id);
    //se for um conteúdo o nodo a que queremos adicionar este conjunto é o seu subnodo OR
    var is_content = node.type == "content";
    var needs_info = get_needs(node_id);
    var has_sets = Object.keys(needs_info.sets).length;
    var has_language = needs_info.language != null;
    if(is_content){
        var needs;
        var or_id;
        //se o conteúdo ainda não tiver um OR criá-lo
        if(!has_sets){
          needs = {};
          needs[and_id] = true;
          or_id = make_connector(needs,"or");
        }
        else{
          or_id = Object.keys(Nodes.findOne(Object.keys(needs_info.sets)[0]).needed_by)[0];
          var or = Nodes.findOne(or_id);
          //pegar nos diversos ANDs de requesitos
          needs = or.needs;
          //adicionar-lhes este conjunto de conceitos
          needs[and_id] = true;
          //recalcular os pesos do OR
          var weights = compute_weights(needs,"or");
          needs = weights.weights;
          var bias = weights.bias;
          Nodes.update({_id: or_id},{$set:{needs:needs,bias:bias}});
          //fazer a referência ao OR no AND
          add_to_field(and_id,"needed_by",or_id,true);
        }
    }
    else{
        //pegar nos diversos ANDs de requesitos
        var needs = node.needs;
        //adicionar-lhes este conjunto de conceitos
        needs[and_id] = true;
        //recalcular os pesos do OR
        var weights = compute_weights(needs,"or");
        needs = weights.weights;
        var bias = weights.bias;
        Nodes.update({_id:node_id},{$set:{needs:needs,bias:bias}});
        add_to_field(and_id,"needed_by",node_id,true);
    }
}
//A-OK!

//função que retorna um objecto com a informação dos requesitos linguísticos e conceptuais
get_needs = function(node_id){
    var info = {};
    var node = Nodes.findOne(node_id);
    var or_id = node_id;
    for(var id in node.needs){
      var subnode = Nodes.findOne(id);
      if(subnode.isLanguage){ info["language"] = node.language; }
      else if(subnode.type == "or"){ or_id = id; }
    }
    var or = Nodes.findOne(or_id);
    var set_ids = or.needs;
    for(var id in set_ids){
        set_ids[id] = Nodes.findOne(id).needs;
    }
    info["sets"] = set_ids;
    return info;
}
//A-OK

reset_user = function(user_id){
    Personal.remove({
        user: user_id
    });
    var zeroth_level = Nodes.find({
        type: "content",
        "needs": {}
    }).fetch();
    for (var i in zeroth_level) {
        var node = zeroth_level[i];
        update_state(node._id, user_id);
    };
}
//A-OK

update_state = function(node_id,user_id){
    var state = compute_state(node_id,user_id);
    set_state(state,node_id,user_id);
    return state;
}
//A-OK

find_micronodes = function(node_ids) {
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

down_search = function(node_ids){
    var tree = node_ids;
    for(var id in tree){
        var needs = Nodes.findOne(id).needs;
        tree[id] = down_search(needs);
    }
    return tree;
};

//update forward tree
forward_update = function(node_ids, user_id) {
    var current_layer = node_ids;
    while (1) {
        var next_layer = find_forward_layer(current_layer);
        if (Object.keys(next_layer).length == 0) {
            break;
        }
        for (var node_id in next_layer) {
            var state = update_state(node_id, user_id);
            //update_completion(node_id, user_id);
            var node = Nodes.findOne(node_id);
        }
        current_layer = next_layer;
    }
};

change_states = function(state,user_id){
    for(var id in state){
        set_state(state[id],id,user_id);
    }
    forward_update(state,user_id);
};

change_state = function(state,node_id,user_id){
    var states = {}; states[node_id] = state;
    change_states(states,user_id);
};

//retorna os estados necessários dos nodos afectados pelas alterações
simulate = function(target, user_id) {
    var output_layer = target;
    var input_layer = find_micronodes(output_layer);
    //make sure everything is up to date
    forward_update(input_layer, user_id);
    //draw tree
    var tree = find_backward_tree(target);
    //get weights, types and states
    var state = {};
    var needs = {};
    var type = {};
    var contains = {};
    var locked = {};
    for (var order in tree) {
        var layer = tree[order];
        for (var node_id in layer) {
            state[node_id] = get_state(node_id, user_id);
            locked[node_id] = is_locked(node_id, user_id);
            var node = Nodes.findOne(node_id);
            needs[node_id] = {};
            needs[node_id]["weights"] = node.needs;
            needs[node_id]["bias"] = node.bias;
            type[node_id] = node.type;
            contains[node_id] = node.contains;
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
        if( !locked[node_id] ){ min_state[node_id] = 0; }
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
        if(Object.keys(needs[node_id].weights).length == 0){
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
                error[node_id] = locked[node_id]? cut_negative(delta) : delta;
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
                    error[subnode_id] += locked[subnode_id]? cut_negative(delta): delta;
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
            if(typeof state[node_id] === "undefined"){
              var node = Nodes.findOne(node_id);
              needs[node_id] = {};
              needs[node_id].weights = node.needs;
              needs[node_id].bias = node.bias;
              type[node_id] = node.type;
              contains[node_id] = node.contains;
            }
            if(type[node_id] == "exam"){
              var exercises = contains[node_id];
              var norm = exercises.length;
              var score = 0;
              var id;
              for(var i in exercises) {
                id = exercises[i];
                score += get_state(id, user_id);
              }
              state[node_id] = score / norm;
            }
            else{
              var weights = needs[node_id].weights;
              var arg = needs[node_id].bias;
              if (Object.keys(weights).length == 0) {
                  continue;
              }
              for (var subnode_id in weights) {
                  arg += weights[subnode_id] * (state[subnode_id] != null? state[subnode_id] : get_state(subnode_id,user_id));
              }
              state[node_id] = sigmoid(arg);
            }
        }
    }
    return state;

};

//pré-calcula os novos estados
precompute = function(unit_id,user_id) {
  var result = {};
  var target = {};
  target[unit_id] = true;
  var grants = Nodes.findOne(unit_id).grants;
  if(grants){
    for(var id in grants){
      target[id] = true;
    }
  }
  result["success"] = simulate(target,user_id);
  target = {};
  target[unit_id] = false;
  result["failure"] = simulate(target,user_id);
  return result;
}

succeed = function(result,user_id) {
  var success_state = result.success;
  var failure_state = result.failure;
  for(var id in success_state){
    //set_SS(state[id],id,user_id);
    var state = get_state(id,user_id);
    var solidity = get_solidity(id,user_id);
    //se o estado variar de muito reduzir a solidez
    var varies_significantly = Math.abs(success_state[id]-get_state(id,user_id)) > 0.1;
    if( varies_significantly ){
      set_solidity(0,id,user_id);//set_solidity(solidity-1,id,user_id);
      set_state(success_state[id],id,user_id);
    }
    //se o estado não variar,
    else {
      //verificar se no caso contrário variaria,
      var other = failure_state[id]!=null? failure_state[id] : get_state(id,user_id);
      var current = get_state(id,user_id);
      var would_vary_otherwise = Math.abs(other-current) > 0.1;
      //se variar então aumentar a solidez,
      if( would_vary_otherwise ){
        set_solidity(solidity+1,id,user_id);
        set_state(success_state[id],id,user_id);
      }
      //senão manter tal como está
      else {
        set_state(success_state[id],id,user_id);
      }
    }
  }
}

fail = function(result,user_id) {
  var success_state = result.success;
  var failure_state = result.failure;
  for(var id in failure_state){
    var state = get_state(id,user_id);
    var solidity = get_solidity(id,user_id);
    //se o estado variar de muito reduzir a solidez
    var varies_significantly = Math.abs(failure_state[id]-get_state(id,user_id)) > 0.1;
    if( varies_significantly ){
      set_solidity(0,id,user_id);//set_solidity(solidity-1,id,user_id);
      set_state(failure_state[id],id,user_id);
    }
    //se o estado não variar,
    else {
      //verificar se no caso contrário variaria,
      var other = success_state[id]!=null? success_state[id] : get_state(id,user_id);
      var current = get_state(id,user_id);
      var would_vary_otherwise = Math.abs(other-current) > 0.1;
      //se variar então aumentar a solidez,
      if( would_vary_otherwise ){
        set_solidity(solidity+1,id,user_id);
        set_state(failure_state[id],id,user_id);
      }
      //senão manter tal como está
      else {
        set_state(failure_state[id],id,user_id);
      }
    }
  }
}

//retorna objecto que contém os identificadores das unidades que testam um dado conceito
testing_units = function(concept_id,user_id){
  var testability = {};
  var highest_state = {"ascending":0,"descending":0};
  var current_state = get_state(concept_id,user_id);
  var to_test = {};
  to_test[concept_id] = true;
  var orb = find_wake_orb(to_test);
  for(var order in orb){
    var layer = orb[order];
    for(var id in layer){
      var unit_state = get_state(id,user_id);
      if(Nodes.findOne(id).type == "content" ){
        var target = {};
        //test for success
        target[id] = true;
        var altered_state = simulate(target,user_id);
        if(altered_state[concept_id] - current_state > 0.1 && unit_state >= highest_state["ascending"]){
          testability["ascending"] = id;
          highest_state["ascending"] = unit_state;
        }
        else if(altered_state[concept_id] - current_state < -0.1 && unit_state >= highest_state["descending"]){
          testability["descending"] = id;
          highest_state["descending"] = unit_state;
        }
        //test for failure
        target[id] = false;
        var altered_state = simulate(target,user_id);
        if(altered_state[concept_id] - current_state > 0.1 && unit_state >= highest_state["ascending"]){
          testability["ascending"] = id;
          highest_state["ascending"] = unit_state;
        }
        else if(altered_state[concept_id] - current_state < -0.1 && unit_state >= highest_state["descending"]){
          testability["descending"] = id;
          highest_state["descending"] = unit_state;
        }
      }
      if( highest_state["ascending"] > READY && highest_state["descending"] > READY ){ break; }
    }
  }
  return testability;
};

positive_impact_units = function(unit_ids,user_id){
  var found_unit = {};
  var found_unit_state = 0;
  var current_states = {};
  var to_test = {};
  for(var unit_id in unit_ids){
    var needs = Nodes.findOne(unit_id).needs;
    if(needs){
      for(var id in needs){
        to_test[id] = true;
        current_states[id] = get_state(id,user_id);
      }
    }
  }
  var orb = find_wake_orb(to_test);
  for(var order in orb){
    var layer = orb[order];
    for(var id in layer){
      var node_state = get_state(id,user_id);
      var node = Nodes.findOne(id);
      if(node.type == "content" ){
        var target = {};
        //test for success
        target[id] = true;
        for(var granted_id in node.grants){ target[granted_id] = true; }
        var altered_state = simulate(target,user_id);
        for(var unit_id in to_test){
          if(altered_state[unit_id] - current_states[unit_id] > 0.1 && node_state >= found_unit_state){
            found_unit = id;
            found_unit_state = node_state;
          }
        }
        if( found_unit_state > READY ){ break; }
      }
    }
  }
  return found_unit;
};

find_starting_lesson = function(unit_ids,user_id) {
    var current = {};
    var visited = {};
    for(var id in unit_ids){ current[id] = true; }
    while(true){
      var id = positive_impact_units(current,user_id);
      var state = get_state(id,user_id);
      if( state > READY || id == null || visited[id] ){ break; }
      current = {};
      current[id] = true;
      visited[id] = true;
    }
    return id;
}

find_orb = function(node_ids,user_id) {
    var orb = {};
    for(var node_id in node_ids){
        var node = Nodes.findOne(node_id);
        //if down is activated add required nodes
        if(node_ids[node_id]){
            var needs = node.needs;
            for(var id in needs){ orb[id] = true; }
        }
        //add these anyway
        var granted_by = node.granted_by;
        for(var id in granted_by){
            orb[id] = true;
        }
        var needed_by = node.needed_by;
        for(var id in needed_by){
            if( !(id in orb) ){ orb[id] = true/*false*/; }
        }
        var contains = node.contains;
        if(typeof contains !== "undefined"){
            for(var i in contains){
              var id = contains[i];
              if( !(id in orb) ){ orb[id] = true; }
            }
        }
        var contained_in = node.contained_in;
        if(typeof contained_in !== "undefined"){
            for(var id in contained_in){
              if( !(id in orb) ){ orb[id] = true; }
            }
        }
    }
    return orb;
};

//encontra toda a região da rede que pode potencialmente afectar positivamente o nodo de objectivo
find_missing_bush = function(node_ids,user_id) {
    var bush = [];
    var loose = {};
    var origin = {};
    for(var id in node_ids){
        origin[id] = get_state(id,user_id);
    }
    bush.push(origin);
    var bag = node_ids;
    var current_layer = find_orb(node_ids,user_id);
    while(1){
        bush.push({});
        var to_keep = {};
        for(var id in current_layer){
            var state = get_state(id,user_id);
            var type = Nodes.findOne(id).type;
            //var id_in_bag = typeof bag[id] !== null
            if( type == "content" && !bag[id] ){
                bush[bush.length-1][id] = state;
                bag[id] = true;
                if( state < READY ){ to_keep[id] = true; }
            }
            else if( type != "content" && !bag[id] ){
                if(state < READY){
                  bush[bush.length-1][id] = state;
                  bag[id] = true;
                  to_keep[id] = current_layer[id];
                }
                var info = Personal.findOne({node:id,user:user_id});
                if(info){
                  loose[id] = info.solidity < 3;
                }
                else{
                  loose[id] = false;
                }
            }
        }
        current_layer = find_orb(to_keep);
        if( Object.keys(bush[bush.length-1]).length == 0 ){ bush.pop(); }
        if( Object.keys(current_layer).length == 0 ){ break; }
    }
    return {"bush": bush, "ids": bag, "loose": loose};
};

//fazer uma versão desta função para ser précalculada enquanto o utilizador faz a unidade
find_useful_content = function(node_ids, user_id, not_in = {}){
    var find = find_missing_bush(node_ids,user_id);
    var bush = find.bush;
    var ids = find["ids"];
    var loose = find.loose;
    for(var id in loose){
        if(loose[id]){
          //find two units to test this concept in success and in failure
          tests = testing_unit(id,user_id);
        }
    }
    for(var n in bush){
        var layer = bush[n];
        for(var id in layer){
            var node = Nodes.findOne(id);
            var state = get_state(id,user_id);
            if(node.type == "content" && state > READY && typeof not_in[id] === "undefined"){
                var target = {};
                target[id] = true;
                for(var granted_id in node.grants){ target[granted_id] = true; }
                var simulation = simulate(target,user_id);
                for(var altered_id in simulation){
                    var change = simulation[altered_id] - get_state(altered_id,user_id);
                    var is_in_bush = ids[altered_id];
                    if(change > 0.1 && is_in_bush){
                      return id;
                    }
                }
                //return id;
            }
        }
    }
}



Meteor.methods({

  /*{ parameters: {name: "unit", description: "blabla"},
      type: "content",
      grants: { id: true, id: true, id: true },
      needs: { language: id ,
               concepts: [{ id: true, id: true },{ id: true, id: true }] } }*/
  create: function(p) {
    return full_create(p);
  },

  addAuthor: function(nodeID,authorID) {
    return add_author(nodeID,authorID);
  },

  editNode: function(nodeID,parameters){
    return edit_node_info(nodeID,parameters);
  },

  editNeed: function(setID, concepts) {
    return edit_requirement(setID, concepts);
  },

  editLanguage: function(unitId, newLanguageId) {
    return change_language_requisite(unitId, newLanguageId);
  },

  addNeed: function(nodeID, concepts) {
    return add_requirement(nodeID, concepts);
  },

  editGrants: function(nodeID, concepts) {
    return edit_grants(nodeID, concepts);
  },

  removeNode: function(nodeID) {
    return remove_node(nodeID);
  },

  deleteAllNodes: function() {
    var nodes = Nodes.find().fetch();
    for(var i in nodes){
      remove_node(nodes[i]._id);
    }
  },

  removeNeed: function(setID) {
    return edit_requirement(setID, {});
  },

  editContains: function(examId, exercises) {
    return edit_contains(examId, exercises);
  },

  removeAuthor: function(nodeID,authorID) {
    return remove_author(nodeID,authorID);
  },

  resetUser: function(userID) {
    var knownLanguages = {};
    var languages = Nodes.find({isLanguage:true}).fetch();
    for(var i in languages){
      var id = languages[i]._id;
      knownLanguages[id] = get_state(id,userID);
    }
    reset_user(userID);
    change_states(knownLanguages,userID);
    var goalId = Meteor.users.findOne(userID).goal;
    if(goalId){
      var goal = {}; goal[goalId] = true;
      var unit = find_useful_content(goal,userID);
      if(unit !== null && typeof unit !== "undefined"){ Meteor.users.update({_id:userID},{$set:{goal:goalId,nextUnit:unit}}); }
    }
  },

  //devolve um objecto que contem os requesitos linguisticos e conceptuais dum determinado nodo
  getNeeds: function(id) {
    return get_needs(id);
  },

  precompute: function(unit_id,user_id) {
    return precompute(unit_id,user_id);
  },

  succeed: function(result,user_id) {
    succeed(result,user_id);
  },

  fail: function(result,user_id) {
    fail(result,user_id);
  },

  setGoal: function(node_id, user_id, not_in = {}){
      /*var goalNode = Nodes.findOne(node_id);
      var goalType = goalNode.type;
      if(goalType == "exam"){
        var goal = node.contains;
      }
      else{
        var goal = {}; goal[node_id] = true;
      }*/
      var goal = {}; goal[node_id] = true;
      var unit = find_useful_content(goal,user_id,not_in);
      if(unit !== null && typeof unit !== "undefined"){ Meteor.users.update({_id:user_id},{$set:{goal:node_id,nextUnit:unit}}); }
      return unit;
  },

  removeGoal: function(user_id){
      Meteor.users.update({_id:user_id},{$set:{goal:null,nextUnit:null}});
  },

  submitExam: function(answers,user_id){
      for(var id in answers){
          var result = precompute(id,user_id);
          if(answers[id]){
            succeed(result,user_id);
          }
          else{
            fail(result,user_id);
          }
      }
  },

  removeExam: function(examId){
      return remove_exam(examId);
  },

  readyThreshold: function(){
    return READY;
  },

  changeStates: function(nodeIds,userId){
    change_states(nodeIds,userId);
  },

  changeState: function(state,nodeId,userId){
    change_state(state,nodeId,userId);
  },

  downSearch: function(ids){
    return down_search(ids);
  }

});
