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

ARG_READY = 6;
ARG_NOT_READY = -12;
WIDTH = ARG_READY - ARG_NOT_READY;

var RATE = 0.1;
var ADJUSTMENT = 2.;
var MAX_STEPS = 10000;
var MIN_STEPS = 10;
var TOLERANCE = 0.01;

compute_weights = function(concepts,operator) {
    var weights = {};
    if(Object.keys(concepts).length == 0) {
        var bias = ARG_READY;
    }
    //aceso se qualquer um dos requesitos estiver activado
    else if(operator == "or"){
        var bias = ARG_NOT_READY;
        for (var id in concepts) {
            weights[id] = WIDTH;
        }
    }
    //aceso se todos os requesitos estiverem activados
    else if(operator == "and"){
        //definição estricta
        /*var bias = ARG_READY - WIDTH*Object.keys(concepts).length;
        for (var id in concepts) {
            set[id] = WIDTH;
        }*/
        //definição relaxada
        var bias = ARG_NOT_READY;
        for (var id in concepts) {
            weights[id] = WIDTH/Object.keys(concepts).length;
        }
    }
    //aceso se todos os requesitos menos um estiverem activados
    else if(operator == "parand"){
        //definição estricta
        /*var bias = ARG_READY - WIDTH*(Object.keys(concepts).length-1);
        for (var id in concepts) {
            set[id] = WIDTH;
        }*/
        //definição relaxada
        var bias = ARG_NOT_READY;
        for (var id in concepts) {
            weights[id] = WIDTH/(Object.keys(concepts).length-1);
        }
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

get_state = function(value,node_id,user_id) {
    return get_personal_property("state",0,value,node_id,user_id);
};

compute_state = function(node_id, user_id, update) {
    var state;
    var node = Nodes.findOne(node_id);
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

//sum of all the needed_by
find_forward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        if (node.type == "content") {
            continue;
        }
        var needed_by = node.needed_by;
        for (var id in needed_by) {
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

find_backward_layer = function(nodes) {
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
                if( state < 0.9 ){ to_keep[node_id] = true; }
            }
            else if( type == "concept" && state < 0.9 && !(node_id in bag) ){
                tree[tree.length-1][node_id] = state;
                bag[node_id] = true;
                to_keep[node_id] = true;
            }
            else if( ( type == "and" || type == "or" || type == "parand" ) && state < 0.9 && !(node_id in bag) ){
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

//FALTAM

//creation functions
create_content = function(parameters) {
    var id = Nodes.insert({
        type: "content",
        created_on: Date.now(),
        name: "",
        description: "",
        content: [],
        needs: {},
        grants: {},
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

full_create = function(p) {
    if (p.type == "concept") {
        var id = create_concept(p.parameters);
    } else if (p.type == "content") {
        var id = create_content(p.parameters);
        var grants = p.grants;
        if(grants){ add_grants(id, grants); }
        var needs = p.needs;
        add_needs(id, needs);
    }
    var users = Meteor.users.find().fetch();
    for (var i in users){
        var user_id = users[i]._id;
        update_state(id,user_id);
        var fwd = {};
        fwd[id] = true;
        forward_update(fwd,user_id);
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
      if(!new_grants){
        remove_from_field(id,"granted_by",node_id);
      }
    }
    for(var id in new_grants){
      add_from_field(id,"granted_by",node_id);
    }
    Nodes.update({_id: node_id},{ $set: {grants: grants} });
};

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
        //criar porta OR que agrupe os diferentes ANDs dos pré-requesitos
        var subands = {};
        for(var i = 0; i < needs.concepts.length; i++){
            var id = make_connector(needs.concepts[i],"and");
            subands[id] = true;
            var needed_by = Nodes.findOne(id).needed_by;
            needed_by[node_id] = true;
            Nodes.update({_id:id},{$set:
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
        //criar porta OR que agrupe os diferentes ANDs dos pré-requesitos
        var subands = {};
        for(var i = 0; i < needs.concepts.length; i++){
            var id = make_connector(needs.concepts[i],"and");
            subands[id] = true;
        }
        //se houver conjuntos ligar à porta OR senão ligar ao nodo sempre activo
        var or_id = needs.concepts.length? make_connector(subands,"or"):Nodes.findOne({name:"ALWAYS_ACTIVE"})._id;
        //criar porta AND ligada directamente ao nodo e que contenha a ligação ao idioma e aos pré-requesitos
        var and = {};
        and[or_id] = true;
        var language_id = needs.language? needs.language : Nodes.findOne({name:"ALWAYS_ACTIVE"})._id;
        and[language_id] = true;
        //adicionar RESSALVA para o caso da língua não existir
        //var and_id = make_connector(and,"and");
        var sublinks = compute_weights(and,"and");
        Nodes.update({_id:node_id},{$set:
          {needs: sublinks.weights, bias:sublinks.bias, language: language_id, requirements: or_id}
        });
        var needed_by = Nodes.findOne(language_id).needed_by;
        needed_by[node_id] = true;
        Nodes.update({_id:language_id},{$set:
          {needed_by: needed_by}
        });
        needed_by = Nodes.findOne(or_id).needed_by;
        needed_by[node_id] = true;
        Nodes.update({_id:or_id},{$set:
          {needed_by: needed_by}
        });
    }
};

remove_node = function(node_id){
    var node = Nodes.findOne(node_id);
    var type = node.type;
    //remover referências a este nodo
    var needs = node.needs;
    for(var id in needs){
        other = Nodes.findOne(id).needed_by;
        delete other[node_id];
        Nodes.update({_id: node_id},{$set:
          {needed_by: other}
        });
    }
    if(node.type == "content"){
        var grants = node.grants;
        for(var id in grants){
            var other = Nodes.findOne(id).granted_by;
            delete other[node_id];
            Nodes.update({_id: node_id},{$set:
              {granted_by: other}
            });
        }
    }
    else{
        if(node.type == "concept"){
            var granted_by = node.granted_by;
            var other;
            for(var id in granted_by){
                other = Nodes.findOne(id).grants;
                delete other[node_id];
                Nodes.update({_id: node_id},{$set:
                  {grants: other}
                });
            }
        }
        var needed_by = node.needed_by;
        for(var id in needs){
            other = Nodes.findOne(id).needs;
            delete other[node_id];
            Nodes.update({_id: node_id},{$set:
              {needs: other}
            });
        }
    }
    //por fim remover o nodo
    Nodes.remove(node_id);
}

edit_node_info = function(node_id,parameters){
    Nodes.update({_id:node_id},{$set:parameters});
}

change_language_requisite = function(content_id,new_language_id){
    var content = Nodes.findOne(content_id);
    var old_language_id = content.language;
    var old_language = Nodes.findOne(old_language_id);
    var other = old_language.needed_by;
    delete other[content_id];
    Nodes.update({_id:old_language_id},{$set:{needed_by:other}});
    var new_language = Nodes.findOne(new_language_id);
    other = new_language.needed_by;
    other[content_id] = true;
    Nodes.update({_id:new_language_id},{$set:{needed_by:other}});
    var needs = content.needs;
    var weight = needs[old_language_id];
    delete needs[old_language_id];
    needs[new_language_id] = weight;
    Nodes.update({_id:content_id},{$set:{needs:needs}})
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
edit_requirement = function(set_id,new_concepts){
    var set = Nodes.findOne(set_id);
    var dropped_concepts = {};
    var inserted_concepts = {};
    var old_concepts = set.needs;
    //encontrar os conceitos abandonados e retirar as suas referências correspondentes
    for(var id in old_concepts){
        var concept = Nodes.findOne(id);
        if(!new_concepts[id]){
            remove_from_field(id,"needed_by",set_id);
        }
    }
    var weights = compute_weights(new_concepts,"and");
    var needs = weights.weights;
    var bias = weights.bias;
    Nodes.update({_id:id},{$set:
      { needs: needs, bias: bias }
    });
    for(var id in new_concepts){
        var concept = Nodes.findOne(id);
        add_to_field(id,"needed_by",set_id,true);
    }
    //apagar o nodo AND do conjunto se ele ficar sem subconceitos
    if(Object.keys(new_concepts).length == 0){
        //o nodo que precisa deste conjunto (que será sempre um OR ou um conceito)
        var node_id = Object.keys(set.needed_by)[0];
        //apagar o nodo, o que vai também apagar a sua referência no sobrenodo
        remove_node(set_id);
        var node = Nodes.findOne(node_id);
        needs = node.needs;
        //recalcular os pesos para dar uma porta OR
        weights = compute_weights(needs,"or");
        needs = weights.weights;
        bias = weights.bias;
        //reinserir esses novos pesos
        Nodes.update({_id:node_id},{$set:{needs:needs,bias:bias}});
    }
}

add_requirement = function(node_id, concepts){
    var node = Nodes.findOne(node_id);
    //se for um conteúdo o nodo a que queremos adicionar este conjunto é o seu subnodo OR
    if(node.type == "content"){
        node_id = node.requirements;
        node = Nodes.findOne(node_id);
    }
    //pegar nos diversos ANDs de requesitos
    var needs = node.needs;
    //adicionar-lhes este conjunto de conceitos
    var and_id = make_connector(concepts,"and");
    needs[and_id] = true;
    //recalcular os pesos do OR
    var weights = compute_weights(needs,"or");
    needs = weights.weights;
    var bias = weights.bias;
    Nodes.update({_id:node_id},{$set:{needs:needs,bias:bias}});
}

//função que retorna um objecto com a informação dos requesitos linguísticos e conceptuais
get_needs = function(node_id){
    var info = {};
    var node = Nodes.findOne(node_id);
    if(node.type == "content"){ info["language"] = node.language; }
    var set_ids = node.type == "concept"? node.needs : Nodes.findOne(node.requirements).needs;//adicionar uma RESSALVA para o caso do nodo ser um operador
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

//update forward tree
forward_update = function(node_ids, user_id) {
    var current_layer = node_ids;
    while (1) {
        var next_layer = find_forward_layer(current_layer);
        if (Object.keys(next_layer).length == 0) {
            break;
        }
        for (var node_id in next_layer) {
            //console.log(node_id);
            update_state(node_id, user_id);
            //update_completion(node_id, user_id);
        }
        current_layer = next_layer;
    }
};

//retorna os estados necessários dos nodos afectados pelas alterações
simulate = function(target, user_id) {
    var output_layer = target;
    var input_layer = find_micronodes(output_layer);
    //make sure everything is up to date
    forward_update(find_micronodes(target), user_id);
    //draw tree
    var tree = find_backward_tree(target);
    //fill in state object
    var state = {};
    for (var order in tree) {
        var layer = tree[order];
        for (var node_id in layer) {
            state[node_id] = get_state(node_id, user_id);
        }
    }
    //compute maximum activations
    //increment input states
    for (var node_id in input_layer) {
        state[node_id] = 1;
    }
    var max_states = {};
    //forward propagate
    for (var order = tree.length - 2; order >= 0; order--) {
        var layer = tree[order];
        for (var node_id in layer) {
            var node = Nodes.findOne(node_id);
            var weights = node.needs;
            if (Object.keys(weights).length == 0) {
                continue;
            }
            var arg = node.bias;
            for (var subnode_id in weights) {
                arg += weights[subnode_id] * state[subnode_id];
            }
            state[node_id] = sigmoid(arg);
            if( output_layer[node_id] != null ){ max_states[node_id] = state[node_id]; }
        }
    }
    //compute minimum activations
    //increment input states
    for (var node_id in input_layer) {
        state[node_id] = 0;
    }
    var min_states = {};
    //forward propagate
    for (var order = tree.length - 2; order >= 0; order--) {
        var layer = tree[order];
        for (var node_id in layer) {
            var node = Nodes.findOne(node_id);
            var weights = node.needs;
            if (Object.keys(weights).length == 0) {
                continue;
            }
            var arg = node.bias;
            for (var subnode_id in weights) {
                arg += weights[subnode_id] * state[subnode_id];
            }
            state[node_id] = sigmoid(arg);
            if( output_layer[node_id] != null ){ min_states[node_id] = state[node_id]; }
        }
    }
    //update the target to realistic values
    for (node_id in target) {
        target[node_id] = target[node_id] ? max_states[node_id] : min_states[node_id];
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
        var node = Nodes.findOne(node_id);
        if(Object.keys(node.needs).length == 0){
            state[node_id] = target[node_id];
        }
    }
    //initialize all error entries
    for (var i in tree) {
        var layer = tree[i];
        for (node_id in layer) {
            if (node_id in target) {
                saved_output[node_id] = state[node_id];
                error[node_id] = state[node_id] * (1 - state[node_id]) * (target[node_id] - state[node_id]);
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
                node = Nodes.findOne(node_id);
                weights = node.needs;
                if (Object.keys(weights).length == 0) {
                    continue;
                }
                for (var subnode_id in weights) {
                    var weight = weights[subnode_id];
                    error[subnode_id] += error[node_id] * weight;
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
                    var node = Nodes.findOne(node_id);
                    var weights = node.needs;
                    if (Object.keys(weights).length == 0) {
                        continue;
                    }
                    var arg = node.bias;
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
    for (var order = tree.length - 2; order >= 0; order--) {
        var layer = tree[order];
        for (var node_id in layer) {
            var node = Nodes.findOne(node_id);
            var weights = node.needs;
            if (Object.keys(weights).length == 0) {
                continue;
            }
            var arg = node.bias;
            for (var subnode_id in weights) {
                arg += weights[subnode_id] * state[subnode_id];
            }
            state[node_id] = sigmoid(arg);
        }
    }
    return state;
    /*var change = {};
    for (var node_id in state) {
        change[node_id] = state[node_id] - get_state(node_id,user_id);
    }
    return change;*/

};

//melhorar esta função para incluir efeitos que vêm debaixo do conceito a testar
testing_units = function(concept_id,user_id){
  var testability = {};
  var to_test = {};
  to_test[concept_id] = true;
  var tree = find_forward_tree(to_test);
  for(var order in tree){
    var layer = tree[order];
    for(var id in layer){
      if(Nodes.findOne(id).type == "content"){
        testability[id] = {};
        var target = {};
        //test for success
        target[id] = true;
        var state = simulate(target,user_id);
        if(Math.abs(state[concept_id] - get_state(concept_id,user_id)) > 0.1){
          testability[id]["success"] = true;
        }
        else{ testability[id]["success"] = true; }
        //test for failure
        target[id] = false;
        var state = simulate(target,user_id);
        if(Math.abs(state[concept_id] - get_state(concept_id,user_id)) > 0.1){
          testability[id]["failure"] = true;
        }
        else{ testability[id]["failure"] = false; }
      }
    }
  }
  return testability;
}

Meteor.methods({

  create: function(p) {
      return full_create(p);
  },

  addAuthor: function(nodeID,authorID) {
      return add_author(nodeID,authorID);
  },

  editNode: function(nodeID,parameters){
      return edit_node(nodeID,parameters);
  },

  editNeed: function(setID, concepts) {
      return edit_requirement(setID, concepts);
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

  removeNeed: function(setID) {
      return edit_requirement(setID, {});
  },

  removeAuthor: function(nodeID,authorID) {
      return remove_author(nodeID,authorID);
  },

  resetUser: function(userID) {
      return reset_user(userID);
  },

  get_needs: function(id) {
      return get_needs(id);
  },

  succeed: function(unit_id,user_id) {
    var target = {};
    target[unit_id] = true;
    var grants = Nodes.findOne(user_id).grants;
    if(grants){
      for(var id in grants){
        target[id] = true;
      }
    }
    var state = simulate(target,user_id);
    for(var id in state){ set_state(state[id],id,user_id); }
  },

  fail: function(unit_id,user_id) {
    var target = {};
    target[unit_id] = false;
    var state = simulate(target,user_id);
    for(var id in state){ set_state(state[id],id,user_id); }
  }

});
