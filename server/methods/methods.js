//math functions

sigmoid = function(x) {
    return 1. / (1 + Math.exp(-x));
}

inverseSigmoid = function(x) {
    return -Math.log(x / (1 - x));
}

box = function(x) {
    return x > 1 ? 1 : (x < 0 ? 0 : x);
}

//server variables

MINIMUM_EASY = sigmoid(2);
MINIMUM_MEDIUM = sigmoid(-2);
MAXIMUM_HARD = sigmoid(-4);
WIDTH = 6;

var RATE = 0.1;
var MAX_STEPS = 10000;
var MIN_STEPS = 10;
var TOLERANCE = 0.005;

//server functions

/*buildSet = function(list) {
    var set = {};
    for (var i = 0; i < list.length; i++) {
        var key = list[i];
        set[key] = WIDTH;
    }
    set["bias"] = -WIDTH * (list.length - 1);
    return set;
}*/

build_set = function(concepts) {
    var set = {};
    for (var id in concepts) {
        set[id] = WIDTH;
    }
    var bias = -WIDTH * (Object.keys(concepts).length - 1);
    return {
        weights: set,
        bias: bias
    };
}

remove_ocurrences = function(item, list) {
    for (var i = list.length; i--;) {
        if (list[i] === item) {
            list.splice(i, 1);
        }
    }
}

get_state = function(node_id, user_id) {
    var node = Nodes.findOne({
        _id: node_id
    });
    var info = Personal.findOne({
        user: user_id,
        node: node_id
    });
    return info ? (info.state ? info.state : 0) : 0;
}

set_state = function(state, node_id, user_id) {
    var info = Personal.findOne({
        user: user_id,
        node: node_id
    });
    if (info) {
        Personal.update({
            _id: info._id
        }, {
            $set: {
                state: state
            }
        })
    } else {
        Personal.insert({
            user: user_id,
            node: node_id,
            state: state
        })
    }
}

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
}

set_completion = function(value,node_id,user_id) {
    return set_personal_property("completion",value,node_id,user_id);
}

set_depth = function(value,value,node_id,user_id) {
    return set_personal_property("depth",value,node_id,user_id);
}

get_personal_property = function(property, default_value, node_id, user_id) {
  var node = Nodes.findOne({
      _id: node_id
  });
  var info = Personal.findOne({
      user: user_id,
      node: node_id
  });
  return info ? (info[property] ? info[property] : default_value) : default_value;
}

get_completion = function(node_id,user_id) {
    return get_personal_property("completion",0,node_id,user_id);
}

get_depth = function(node_id,user_id) {
    return get_personal_property("depth",0,node_id,user_id);
}

compute_requirement_state = function(requirement_id, user_id) {
    var requirement = Requirements.findOne(requirement_id);
    var weights = requirement.weights;
    var arg = requirement.bias;
    for (var concept in weights) {
        var state = get_state(concept, user_id);
        var weight = weights[concept];
        arg += state * weight;
    }
    return sigmoid(arg);
}

compute_requirement_completion = function(requirement_id, user_id) {
    var requirement = Requirements.findOne(requirement_id);
    var weights = requirement.weights;
    var total_completion = 0;
    var normalization = 0;
    for (var concept in weights) {
        var completion = get_completion(concept, user_id);
        var weight = weights[concept];
        total_completion += completion * weight;
        normalization += weight;
    }
    return total_completion/normalization;
};

compute_state = function(node_id, user_id) {
    var node = Nodes.findOne(node_id);
    var requirements = node.needs;
    //if it's a microconcept, do not update
    if (Object.keys(requirements).length === 0) {
        if (node.type == "concept") {
            return get_state(node_id, user_id);
        } else if (node.type == "content") {
            return 1;
        }
    }
    //if not pick the highest state of its requirements
    var max = 0.0;
    for (var req_id in requirements) {
        var state = compute_requirement_state(req_id, user_id);
        max = state > max ? state : max;
    }
    return max;
};

compute_completion = function(node_id, user_id) {
    var max = 0;
    var node = Nodes.findOne(node_id);
    var requirements = node.needs;
    //if it's a microconcept, set max to its current state
    if (Object.keys(requirements).length === 0) {
        max = get_state(node_id, user_id);
    }
    //then compare that to the maximum completion rate of the units that grant it
    var granted_by = node.granted_by;
    if(granted_by){
        for(var id in node.granted_by){
            var completion = get_completion(id,user_id);
            max = max>completion? max : completion;
        }
    }
    //then compare that to the maximum completion of its requirements
    for (var req_id in requirements) {
        var completion = compute_requirement_completion(req_id, user_id);
        max = completion > max ? completion : max;
    }
    return max;
};

//computes the state of the node and saves it to the database
update_state = function(node_id, user_id) {
    var state = compute_state(node_id, user_id);
    set_state(state, node_id, user_id);
    return state;
};

//computes the completion of the node and saves it to the database
update_completion = function(node_id, user_id) {
    var completion = compute_completion(node_id, user_id);
    set_completion(completion, node_id, user_id);
    return completion;
};

reset_user = function(user_id) {
    Personal.remove({
        user: user_id
    });
    update_zeroth_level(user_id);
};

//finds all units that do not require anything
set_zeroth_level = function() {
    return Nodes.update({
        type: "content",
        "needs": {}
    }, {
        $set: {
            level: 0
        }
    }, {
        multi: true
    });
};

find_zeroth_level = function() {
    return Nodes.find({
        type: "content",
        "needs": {}
    }).fetch();
};

update_zeroth_level = function(user_id) {
    var zeroth_level = Nodes.find({
        type: "content",
        "needs": {}
    }).fetch();
    for (var i in zeroth_level) {
        var node = zeroth_level[i];
        update_state(node._id, user_id);
    }
};

find_forward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        if (node.type == "content") {
            continue;
        }
        var in_set = node.in_set;
        for (var requirement_id in in_set) {
            var set = Requirements.findOne(requirement_id);
            var next_node = set.node;
            layer[next_node] = true;
        }
    }
    return layer;
};

find_full_forward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        if (node.grants) {
            for(var granted_id in node.grants) {
                layer[granted_id] = true;
            }
        }
        var in_set = node.in_set;
        for (var requirement_id in in_set) {
            var requirement = Requirements.findOne(requirement_id);
            var next_node = requirement.node;
            layer[next_node] = true;
        }
    }
    console.log(layer);
    return layer;
};

find_backward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        var requirements = node.needs;
        for (var requirement_id in requirements) {
            var weights = Requirements.findOne(requirement_id).weights;
            for (var subnode_id in weights) {
                layer[subnode_id] = true;
            }
        }
    }
    return layer;
};

find_full_backward_layer = function(nodes) {
    var layer = {};
    for (var node_id in nodes) {
        var node = Nodes.findOne(node_id);
        var requirements = node.needs;
        for (var requirement_id in requirements) {
            var weights = Requirements.findOne(requirement_id).weights;
            for (var subnode_id in weights) {
                layer[subnode_id] = true;
            }
        }
        var granted_by = node.granted_by;
        for (var unit_id in granted_by) {
            layer[unit_id] = true;
        }
    }
    return layer;
};

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
                tree[tree.length-1][node_id] = true;
                bag[node_id] = true;
                if( state < 0.9 ){ to_keep[node_id] = true; }
            }
            else if( type == "concept" && state < 0.9 && !(node_id in bag) ){
                tree[tree.length-1][node_id] = true;
                bag[node_id] = true;
                to_keep[node_id] = true;
            }
        }
        current_layer = find_full_backward_layer(to_keep);
        if( Object.keys(current_layer).length === 0 ){ break; }
    }
    return tree;
};

advise = function(goals,user_id){
    var advice = [];
    var subtree = find_missing_subtree(goals,user_id);
    for(var layer in subtree){
        for(var node_id in subtree[layer]){
            var state = get_state(node_id,user_id);
            var type = Nodes.findOne(node_id).type;
            if( state > 0.9 && type == "content" ){ advice.push(node_id); }
        }
    }
    return advice;
};

count_concepts_to_goal = function(goals,user_id){
    var subtree = find_missing_subtree(goals,user_id);
    n=0;
    for(var layer in subtree){
        for(var node_id in subtree[layer]){
            var type = Nodes.findOne(node_id).type;
            if( type == "concept" ){ n++; }
        }
    }
    return n;
};

starting_concepts = function(goals,user_id){
    var concepts = {};
    var advice = advise(goals,user_id);
    for(var i in advice){
        var unit = Nodes.findOne(advice[i]);
        var grants = unit.grants;
        for(var id in grants){
            concepts[id] = true;
        }
    }
    return concepts;
};

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
        if (Object.keys(next_layer).length === 0) {
            break;
        }
        for (var node_id in next_layer) {
            update_state(node_id, user_id);
            update_completion(node_id, user_id);
        }
        current_layer = next_layer;
    }
};

//update of full forward tree
full_forward_update = function(node_ids, user_id) {
    var current_layer = node_ids;
    while (1) {
        var next_layer = find_full_forward_layer(current_layer);
        if (Object.keys(next_layer).length === 0) {
            break;
        }
        for (var node_id in next_layer) {
            console.log(node_id);
            update_state(node_id, user_id);
            update_completion(node_id, user_id);
        }
        current_layer = next_layer;
    }
}

readapt = function(target, user_id) {
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
    //compute maximum and minimum activations
    var max_states = {};
    var min_states = {};
    for (var node_id in target) {
        var node = Nodes.findOne(node_id);
        var requirements = node.needs;
        var max_maximal_activation = 0.;
        var max_minimal_activation = 0.;
        for (var requirement_id in requirements) {
            var requirement = Requirements.findOne(requirement_id);
            var weights = requirement.weights;
            var max_arg = 0.;
            var arg = requirement.bias;
            for (var subnode_id in weights) {
                max_arg += weights[subnode_id];
                arg += weights[subnode_id] * state[subnode_id];
            }
            var maximal_activation = sigmoid(max_arg);
            max_maximal_activation = (maximal_activation > max_maximal_activation) ? maximal_activation : max_maximal_activation;
            var minimal_activation = sigmoid(requirement.bias);
            max_minimal_activation = (minimal_activation > max_minimal_activation) ? minimal_activation : max_minimal_activation;
            state[requirement_id] = sigmoid(arg);
        }
        if (Object.keys(requirements).length === 0) {
            max_maximal_activation = 1;
            max_minimal_activation = 0;
            //if it's a microconcept, update it straight away
            state[node_id] = target[node_id];
        }
        max_states[node_id] = max_maximal_activation;
        min_states[node_id] = max_minimal_activation;
    }
    //update the target to realistic values
    for (var node_id in target) {
        target[node_id] = target[node_id] ? max_states[node_id] : min_states[node_id];
    }
    //define maxmimum and minimum variations
    var max_dist = 0;
    for (var node_id in target) {
        var dist = Math.abs(target[node_id] - state[node_id]);
        max_dist = max_dist < dist ? dist : max_dist;
    }
    var MAX_VAR = max_dist / MIN_STEPS;
    var MIN_VAR = max_dist / MAX_STEPS;
    //define target layer errors, save current output states and compute total error
    var saved_output = {};
    var error = {};
    var max_error = 0;
    /*for( var node_id in target ){
        saved_output[node_id] = state[node_id];
        error[node_id] = state[node_id]*( 1 - state[node_id] )*( target[node_id] - state[node_id] );
        max_error = Math.abs( target[node_id] - state[node_id] ) > max_error? Math.abs( target[node_id] - state[node_id] ) : max_error;
    }*/
    //initialize all error entries
    for (var i in tree) {
        var layer = tree[i];
        for (var node_id in layer) {
            if (i == 0) {
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
    for (var node_id in input_layer) {
        saved_input[node_id] = state[node_id];
    }
    //return {"tree":tree,"error":error,"target":target,"state":state};
    //begin subnetwork update
    while (max_error > TOLERANCE) {
        //reset bounds
        var is_top_set = false;
        var is_bottom_set = false;
        var upper_bound = Math.pow(10, 10);
        var lower_bound = 0;
        //backpropagation
        for (var order in tree) {
            var layer = tree[order];
            for (var node_id in layer) {
                var node = Nodes.findOne(node_id);
                var requirements = node.needs;
                if (Object.keys(requirements).length == 0) {
                    continue;
                }
                var max = 0;
                var active_requirement = Object.keys(requirements)[0];
                for (var requirement_id in requirements) {
                    max = state[requirement_id] > max ? state[requirement_id] : max;
                    active_requirement = state[requirement_id] > max ? requirement_id : active_requirement;
                }
                var weights = Requirements.findOne(active_requirement).weights;
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
                    var requirements = node.needs;
                    if (Object.keys(requirements).length == 0) {
                        continue;
                    }
                    var max = 0;
                    for (var requirement_id in requirements) {
                        var requirement = Requirements.findOne(requirement_id);
                        var weights = requirement.weights;
                        var arg = requirement.bias;
                        for (subnode_id in weights) {
                            arg += weights[subnode_id] * state[subnode_id];
                        }
                        state[requirement_id] = sigmoid(arg);
                        max = state[requirement_id] > max ? state[requirement_id] : max;
                    }
                    state[node_id] = max;
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
    for (var node_id in state) {
        set_state(state[node_id], node_id, user_id);
    }
    forward_update(input_layer, user_id);

}

most_active_requirement = function(node_id,user_id){
    var node = Nodes.findOne(node_id);
    requirements = node.needs;
    var max = 0;
    var max_id = "";
    for(requirement_id in requirements){
        var state = compute_requirement_state(requirement_id,user_id);
        max = max > state ? max : state;
        if(state >= max){
            max = state;
            max_id = requirement_id;
        }
    }
    return max_id;
}



/*
get_condition = function(node_id,user_id) {
    var info = Personal.findOne({
        node: node_id,
        user: user_id
    });
    if(info){
        return info.condition? info.condition : "unknown";
    }
    else { return "unknown"; }
}

get_solidity = function(node_id,user_id) {
    var info = Personal.findOne({
        node: node_id,
        user: user_id
    });
    if(info){
        return info.solidity? info.solidity : 0;
    }
    else { return 0; }
}

update_condition = function(node_id,user_id) {
    var marks = get_marks(node_id,user_id);
    var s = 0;
    for(var n = marks.length; n >= 0; n--) {
        if( s*marks[n] >= 0 ) {
            s += marks[n];
        }
        else { break; }
    }
    var condition = 0;
    if( s >= 3 ){ condition = "knows"; }
    else if( s < -3 ){ condition = "does not know"; }
    else if( -3 < s && s < 3 && s != 0 ){ condition = "in transition"; }
    else if( s == 0 ){ condition = "unknown"; }
    Personal.update({
        node: node_id,
        user: user_id
    },{
        $set: { condition: condition, confidence: s, lastUpdate: Date.now() }
    });
}

get_marks = function(node_id,user_id) {
    var info = Personal.findOne({node: node_id,user: user_id});
    if(info){
        return info.marks? info.marks : [];
    }
    else { return []; }
}

set_attention = function(bool,node_id,user_id) {
    var node = Nodes.findOne(node_id);
    Personal.update({
        node: node_id,
        user:user_id
    },{
        $set: { requiresAttention: bool }
    });
}

add_mark = function(mark, node_id, user_id) {
    var info = Personal.findOne({
        user: user_id,
        node: node_id
    });
    if (info) {
        Personal.update({
            _id: info._id
        }, {
            $push: {
                marks: mark
            }
        });
    } else {
        Personal.insert({
            user: user_id,
            node: node_id,
            marks: [mark]
        })
    }
    var condition = update_condition(node_id,user_id);
    if(condition == "knows") {
        set_attention(false,node_id,user_id);
    }
    else if(condition == "does not know") {
        set_attention(false,node_id,user_id);
    }
    else if(condition == "in transition") {
        set_attention(true,node_id,user_id);
    }
    else {
        set_attention(false,node_id,user_id);
    }
}

cascade = function(mark,node_id,user_id) {
    var node = Nodes.findOne(node_id);
    var requirements = node.needs;
    //if it's a microconcept tick the mark
    if( Object.keys(requirements).length == 0 ){
        if( mark == 0 ){
            set_attention(true,node_id,user_id);
        }
        else {
            add_mark(mark,node_id,user_id);
        }
    }
    //if not, cascade down
    else {
        for(var requirement_id in requirements){
            var requirement = Requirements.findOne(requirement_id);
            var weights = requirement.weights;
            var N = Object.keys(weights);
            var relay_mark = 0;
            var requirement_condition = get_condition(requirement_id,user_id);
            if( mark > 0 ){
                if( requirement_condition == "knows" ){
                   relay_mark = 1/N;
                }
                else if( requirement_condition == "in transition" ){
                    relay_mark = 1/N;
                }
                else if( requirement_condition == "does not know" ){
                    relay_mark = 0;
                }
                else if( requirement_condition == "unknown" ){
                    relay_mark = 0;
                }
            }
            else if( mark < 0 ){
                if( requirement_condition == "knows" ){
                   relay_mark = -1/N;
                }
                else if( requirement_condition == "in transition" ){
                    relay_mark = -1/N;
                }
                else if( requirement_condition == "does not know" ){
                    continue;
                }
                else if( requirement_condition == "unknown" ){
                    relay_mark = -1/N;
                }
            }
            else if( mark == 0 ){
                relay_mark = 0;
            }
            for(var concept_id in weights) {
                cascade(relay_mark,concept_id,user_id);
            }
        }
    }
}
*/

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
        set_completion(1, id, user_id);
    }
    return id;
}

create_concept = function(parameters) {
    var id = Nodes.insert({
        type: "concept",
        created_on: Date.now(),
        name: "",
        description: "",
        granted_by: {},
        in_set: {},
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
        set_completion(0, id, user_id);
    }
    return id;
}

add_author = function(node_id,author_id){
    var authors = Nodes.findOne(node_id).authors;
    authors[author_id] = true;
    Nodes.update({_id: node_id},{$set: {authors: authors}});
    var works = Meteor.users.findOne(author_id).works;
    works[node_id] = true;
    Meteor.users.update({_id: author_id},{$set: {works: works}});
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

add_set = function(node_id, concepts) {
    var set = build_set(concepts);
    var weights = set.weights;
    var bias = set.bias;
    var requirement_id = Requirements.insert({
        node: node_id,
        weights: weights,
        bias: bias
    });
    var update = {};
    update["needs." + requirement_id] = true;
    Nodes.update({
        _id: node_id
    }, {
        $set: update
    });
    for (var id in concepts) {
        var update = {};
        update["in_set." + requirement_id] = true;
        Nodes.update({
            _id: id
        }, {
            $set: update
        });
    }
    var users = Meteor.users.find().fetch();
    for (var i in users) {
        var user_id = users[i]._id;
        //update_state(node_id,user_id);
        //forward_update([node_id],user_id);
    }
    return requirement_id;
}

full_create = function(p) {
    if (p.type == "concept") {
        var id = create_concept(p.parameters);
    } else if (p.type == "content") {
        var id = create_content(p.parameters);
        var grantement = p.grants;
        add_grants(id, grantement);
    }
    //add requirement sets
    for (var i in p.needs) {
        var requirement = p.needs[i];
        add_set(id, requirement);
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
}

//editing functions
edit_node = function(node_id, parameters) {
    Nodes.update({
        _id: node_id
    }, {
        $set: parameters
    });
}

edit_grants = function(node_id, concepts) {
    var old_skills = Nodes.findOne(node_id).grants;
    //delete link with nodes that are no longer granted
    for (var id in old_skills) {
        if (concepts[id] == null) {
            var granted_by = Nodes.findOne(id).granted_by;
            delete granted_by[id];
            var update = {
                granted_by: granted_by
            };
            Nodes.update({
                _id: id
            }, {
                $set: update
            });
        }
    }
    //add the rest
    add_grants(node_id, concepts);
}

edit_set = function(requirement_id, concepts) {
    var requirement = Requirements.findOne(requirement_id);
    var old_weights = requirement.weights;
    var set = build_set(concepts);
    var new_weights = set.weights;
    var bias = set.bias;
    //remove reference to this set in subnodes that are no longer required by it
    for (var node_id in old_weights) {
        if (concepts[node_id] == null) {
            var unset = {};
            unset["in_set." + requirement_id] = true;
            Nodes.update({
                _id: node_id
            }, {
                $unset: unset
            });
        }
    }
    Requirements.update({
        _id: requirement_id
    }, {
        $set: {
            weights: new_weights,
            bias: bias
        }
    });
    for (var id in new_weights) {
        var update = {};
        update["in_set." + id] = true;
        Nodes.update({
            _id: id
        }, {
            $set: update
        });
    }
    var node_id = requirement.node;
    //se o conjunto for vazio apagar o requesito
    if (Object.keys(concepts).length === 0) {
        //apagar a referência no nodo que tinha este requesito
        var node = Nodes.findOne(node_id);
        var needs = node.needs;
        delete needs[requirement_id];
        Nodes.update({
            _id: node_id
        },{
            $set: {needs: needs}}
        );
        //apagar o requesito
        Requirements.remove({
            _id: requirement_id
        });
    }
    //actualizar a rede para todos os utilizadores
    var users = Meteor.users.find().fetch();
    for (var i in users) {
        var user_id = users[i]._id;
        //updateState(node_id,user_id);
        //forward_update([node_id],user_id);
    }
}

remove_set = function(requirement_id) {
    edit_set(requirement_id, {});
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

remove_node = function(node_id){
    var node = Nodes.findOne(node_id);
    //var must_update = find_forward_layer([node_id]);
    //remove all sets from this node
    var needs = node.needs;
    for (var requirement_id in needs) {
        remove_set(requirement_id);
    }
    //remove all edges to this node
    Personal.remove({
        $or: [{
            user: node_id
        }, {
            node: node_id
        }]
    });
    if (node.type == "content") {
        //remove references in concepts that are granted by this content
        var grants = node.grants;
        for (var id in grants) {
            var update = {};
            update["granted_by." + id] = true;
            Nodes.update({
                _id: id
            }, {
                $unset: update
            });
        }
    } else if (node.type == "concept") {
        //remove references in content that grant this concept
        var granted_by = node.granted_by;
        for (var id in granted_by) {
            var update = {};
            update["grants." + id] = true;
            Nodes.update({
                _id: id
            }, {
                $unset: update
            });
        }
        //remove references in sets that require this concept
        var sets = node.in_set;
        for (var requirement_id in sets) {
            var weights = Requirements.findOne({
                _id: requirement_id
            }).weights;
            delete weights[node_id];
            var ids = Object.keys(weights);
            edit_set(requirement_id, weights);
        }
    }
    //and finally dump the node
    Nodes.remove({
        _id: node_id
    });
    //update the forward cone of this node
    /*var users = Meteor.users.find().fetch();
    for(var u in users)
        var user = users[u];
        for(var id in must_update){
            update_state(id,user._id)
        }
    }*/
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
        return edit_set(setID, concepts);
    },

    addNeed: function(nodeID, concepts) {
        return add_set(nodeID, concepts);
    },

    removeNode: function(nodeID) {
        return remove_node(nodeID);
    },

    removeNeed: function(setID) {
        return remove_set(setID);
    },

    removeAuthor: function(nodeID,authorID) {
        return remove_author(nodeID,authorID);
    },

    getState: function(nodeID,userID){
        return get_state(nodeID,userID);
    },

    resetUser: function(userID) {
        return reset_user(userID);
    },

    findForwardLayer: function(nodeIDs) {
        return find_forward_layer(nodeIDs);
    },

    findBackwardLayer: function(nodeIDs) {
        return find_backward_layer(nodeIDs);
    },

    findForwardTree: function(nodeIDs) {
        return find_forward_tree(nodeIDs);
    },

    findBackwardTree: function(nodeIDs) {
        return find_backward_tree(nodeIDs);
    },

    readapt: function(target, userID) {
        return readapt(target, userID);
    },

    succeed: function(nodeID, userID) {
        var target = {};
        var grants = Nodes.findOne(nodeID).grants;
        for(var id in grants){
            target[id] = 1;
        }
        target[nodeID] = 1;
        return readapt(target, userID);
    },

    fail: function(nodeID, userID) {
        var target = {};
        target[nodeID] = 0;
        return readapt(target, userID);
    },

    setGoal: function(nodeID,userID) {
        Goals.remove({
          user: userID
        });
        var goal = {};
        goal[nodeID] = true;
        var units = advise(goal,userID);
        var concepts = starting_concepts(goal,userID);
        var tree = find_missing_subtree(goal,userID);
        var conceptCount = count_concepts_to_goal(goal,userID);
        var existing = Goals.findOne({
          node: nodeID,
          user: userID
        });
        if(!existing){
          Goals.insert({
            node: nodeID,
            user: userID,
            units: units,
            concepts: concepts,
            tree: tree,
            conceptCount: conceptCount
          });
        }
        else{
          Goals.update({_id: existing._id},{
            $set: {
              units: units,
              concepts: concepts,
              tree: tree,
              conceptCount: conceptCount
            }
          });
        }
    },

    removeGoal: function(nodeID,userID) {
      Goals.remove({
        node: nodeID,
        user: userID
      });
    },

    computeState(nodeId,userId){
      return compute_state(nodeId,userId);
    }

});
