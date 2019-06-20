
function idleAnimation(flags, poses, k) {
    var p1 = poses["idle01"];
    var p2 = poses["idle02"];
    var speed = 0.04;
    if (k>0.25 && k<0.75) speed = speed*0.8;
    else speed = 0.04;

    if (flags["flag01"]){
        bss[0].position.y += (0.95- 1.0)*speed;

        loadPoseR(letr3D(p1, p2, k));
        if (k >= 1.0) {
            idleFlags["flag01"] = false;
            idleFlags["flag02"] = true;
            k = 0;
            }
    }
    
    else if (flags["flag02"]){
        bss[0].position.y += (1.0- 0.95)*speed;

        loadPoseR(letr3D(p2, p1, k));
        if (k >= 1.0) {
            idleFlags["flag01"] = true;
            idleFlags["flag02"] = false;
            k = 0;
            }
    }
    k += speed;
    return k;
}


function chunkArray(array, size) {
    let result = []
    let arrayCopy = [...array]
    while (arrayCopy.length > 0) {
        result.push(arrayCopy.splice(0, size))
    }
    return result
}

var jsonToArrayQ = function (jData) {
    var element = [];
    for (i in jData) {
        element.push(jData[i]._x, jData[i]._y, jData[i]._z, jData[i]._w);
    }
    
    return chunkArray(element,4);

}

var jsonToArrayR = function (jData) {
    var element = [];
    for (i in jData) {
        element.push(jData[i]._x, jData[i]._y, jData[i]._z);
    }
    
    return chunkArray(element,3);

}

var loadPoseQ = function (array) {
    for (i in bss_quaternions) bss_quaternions[i].fromArray(array[i]);
}

var loadPoseR = function (array) {
    for (i in bss_rotations) bss_rotations[i].fromArray(array[i]);
}
function parseJSONData (jsonData) {
    var parsed = {};
    var poses = Object.keys(jsonData);
    for (k in poses) {
        parsed[poses[k]] = jsonToArrayR(JSON.parse(jsonData[poses[k]]));
    }
    return parsed;
}




function letr3D(start, stop, increment) {
    var pose = [];
    for (i in start) {
    var m = new THREE.Vector3();
    var a = new THREE.Vector3();
    var b = new THREE.Vector3();
    a.fromArray(stop[i]);
    b.fromArray(start[i]);
    m.subVectors(a, b);
    m.multiplyScalar(increment);
    m.addVectors(m, b);
    
    var eu = new THREE.Euler();
    eu.setFromVector3(m);
    pose.push(eu);
    }
    return jsonToArrayR( pose );
}

// When we download the pose as .json it contains objects 
// Via this function we're parsing it to arrays to benefit Quaternion class's proto function fromArray.

// usage : jsonToArray(yourPoseHere)
// output : length(yourPoseHere)*positions -> positions contain 4 elements in another array -> [_x, _y, _z, _w]