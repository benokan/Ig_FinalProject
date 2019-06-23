


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



function idleAnimation (flags, poses, counter, k) {
    var p1 = poses["idle01"];
    var p2 = poses["idle02"];
    var p3 = poses["idle03"];
    var p4 = poses["idle03b"];
    var speed = 0.04;

    // console.log(k);
    if (!counter) {
        var currPose = JSON.stringify(bss_rotations);
        currPose = jsonToArrayR(JSON.parse(currPose));
        loadPoseR(letr3D(currPose, p1, k));
        k += speed;
        if (k >= 1.0) {

            k = 0;
            counter ++;
            }
    }

    else if (counter<5) {
            
        speed = 0.04;
        if (k>0.25 && k<0.75) speed = speed*0.8;
        else speed = 0.04;

        if (flags["flag01"]){
            loadPoseR(letr3D(p1, p2, k));
            k += speed;
            if (k >= 1.0) {
                idleFlags["flag01"] = false;
                idleFlags["flag02"] = true;
                k = 0;
                }
        }
        
        else if (flags["flag02"]){
            loadPoseR(letr3D(p2, p1, k));
            k += speed;
            if (k >= 1.0) {
                idleFlags["flag01"] = true;
                idleFlags["flag02"] = false;
                k = 0;
                counter++;
                }
            }
    }
    else if (counter == 5) {
        k =0 ;
        idleFlags["flag01"] = false;
        idleFlags["flag02"] = false;
        idleFlags["flag03"] = true;
        idleFlags["flag04"] = false;
        counter ++;
        return [k, counter];
    }

    else if (counter > 5 && counter <10) {

        if (idleFlags["flag03"]){
            var currPose = JSON.stringify(bss_rotations);
            currPose = jsonToArrayR(JSON.parse(currPose));
            loadPoseR(letr3D(currPose, p3, k));
            k += speed;
            if (k >= 1.0) {
                idleFlags["flag03"] = false;
                idleFlags["flag04"] = true;
                k = 0;
                counter ++;
                }
        }
        
        if (flags["flag04"]){
            // speed = speed * 0.5;
            loadPoseR(letr3D(p3, p4, k));
            k += speed;
            if (k >= 1.0) {
                idleFlags["flag04"] = false;
                idleFlags["flag05"] = true;
                k = 0;
                }
        }
        
        else if (flags["flag05"]){
            // speed = speed * 0.5;

            loadPoseR(letr3D(p4, p3, k));
            k += speed;

            if (k >= 1.0) {
                idleFlags["flag04"] = true;
                idleFlags["flag05"] = false;
                k = 0;
                counter ++;
                }
        }    
    }
    if (counter==10) {
        counter = 0;
        idleFlags["flag01"] = true;
        idleFlags["flag04"] = false;
        idleFlags["flag05"] = false;

    }
    return [k, counter];
}

function jumpAnimation(start, walk, z_speed, flags, poses, k) {
    var p1 = poses["jump01"];
    var p2 = poses["jump02"];
    var p3 = poses["jump03"];
    var p4 = poses["jump04"];
    var speed = 0.06;
    walk = false;
    if (flags["flag00"]) {
        z_speed = 5;
        var currPose = JSON.stringify(bss_rotations);
        currPose = jsonToArrayR(JSON.parse(currPose));
        loadPoseR(letr3D(currPose, p1, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag00"] = false;
            flags["flag01"] = true;
            k = 0;
        }
    }
    
    else if (flags["flag01"]) {
        z_speed = 5;
        loadPoseR(letr3D(p1, p2, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag01"] = false;
            flags["flag02"] = true;
            k = 0;
            }
    }

    else if (flags["flag02"]) {
        z_speed = 50;
        bss[0].position.y += (1.6 - bss[0].position.y)*k;
        speed = speed*2;

        loadPoseR(letr3D(p2, p3, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag02"] = false;
            flags["flag03"] = true;
            k = 0;
            speed = speed / 2;

            }
    }

    else if (flags["flag03"]) {
        z_speed = 30;

        bss[0].position.y += (1.2 - bss[0].position.y)*k;
        speed = speed*2;
        loadPoseR(letr3D(p3, p4, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag03"] = false;
            flags["flag04"] = true;
            k = 0;
            speed = speed / 2;

            }
    }

    else if (flags["flag04"]) {
        z_speed = 10;
        bss[0].position.y += (1.0- bss[0].position.y)*k;
        loadPoseR(letr3D(p4, p1, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag04"] = false;
            flags["flag00"] = true;
            start = false;
            walk = true;
            z_speed = 40;
            k = 0;
            }
    }


    return [k, start, walk, z_speed];
}



function runAnimation(flags, poses, k) {
    var p1 = poses["runFrame1"];
    var p2 = poses["runFrame2"];
    var speed = 0.065;

    if (flags["flag00"]){
        speed = speed/2;
        var currPose = JSON.stringify(bss_rotations);
        currPose = jsonToArrayR(JSON.parse(currPose));
        loadPoseR(letr3D(currPose, p1, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag00"] = false;
            flags["flag01"] = true;
            k = 0;
        }
    }

    else if (flags["flag01"]) {
        // bss[0].position.y += (0.95 - 1.0) * speed;

        loadPoseR(letr3D(p1, p2, k));
        if (k >= 1.0) {
            runFlags["flag01"] = false;
            runFlags["flag02"] = true;
            k = 0;
        }
    }

    else if (flags["flag02"]) {
        // bss[0].position.y += (1.0 - 0.95) * speed;

        loadPoseR(letr3D(p2, p1, k));
        if (k >= 1.0) {
            runFlags["flag01"] = true;
            runFlags["flag02"] = false;
            k = 0;
        }
    }

    k += speed;
    speed = speed / 1.5;
    return k;
}

function slipAnimation(start, walk, flags, poses, k) {
    var p1 = poses["slip1"];
    var p2 = poses["slip2"];
    var p3 = poses["slip3"];
    var speed = 0.05;
    walk = false;
    if (flags["flag00"]){
        speed = speed*2;
        var currPose = JSON.stringify(bss_rotations);
        currPose = jsonToArrayR(JSON.parse(currPose));
        loadPoseR(letr3D(currPose, p1, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag01"] = true;
            flags["flag00"] = false;
            k = 0;
        }
    }

    else if (flags["flag01"]) {

        loadPoseR(letr3D(p1, p3, k));
        if (k >= 1.0) {
            slipFlags["flag01"] = false;
            slipFlags["flag02"] = false;
            slipFlags["flag03"] = true;

            k = 0;
        }
    }

    /*     else if (flags["flag02"]){
    
            loadPoseR(letr3D(p2, p3, k));
            if (k >= 1.0) {
                slipFlags["flag01"] = false;
                slipFlags["flag02"] = false;
                slipFlags["flag03"] = true;
                k = 0;
                }
        } */

    else if (flags["flag03"]) {

        loadPoseR(letr3D(p3, p1, k));
        if (k >= 1.0) {
            slipFlags["flag01"] = true;
            slipFlags["flag02"] = false;
            slipFlags["flag03"] = false;
            k = 0;
            walk = true;
            start = false;
        }
    }

    k += speed;
    speed = speed / 1.5;
    return [k, start, walk];
}

function fallAnimation (start, flags, poses, k) {
    var p1 = poses["fall01"];
    var p2 = poses["fall02"];
    var speed = 0.06;
    
    if (flags["flag00"]) {
        speed = speed *3;

        var currPose = JSON.stringify(bss_rotations);
        currPose = jsonToArrayR(JSON.parse(currPose));
        loadPoseR(letr3D(currPose, p1, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag00"] = false;
            flags["flag01"] = true;
            k = 0;
        }
    }
    
    else if (flags["flag01"]) {
        speed = speed *2;
        // if (k>0.5) speed = speed/2;
        // if (k>0.5) bss[0].position.y += (1.2-bss[0].position.y)*k;
        loadPoseR(letr3D(p1, p2, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag01"] = false;
            flags["flag02"] = true;
            k = 0;
            start = false;
            // resetFlags();
            }
    }

    return [k, start];
}

function dabAnimation (flags ,poses, k) {
    var p1 = poses["dabPose"];
    var p2 = poses["idle01"];
    var speed = 0.05;

    if (flags["flag01"]){
        var currPose = JSON.stringify(bss_rotations);
        currPose = jsonToArrayR(JSON.parse(currPose));
        loadPoseR(letr3D(currPose, p1, k));
        k += speed;
        if (k >= 1.0) {
            flags["flag01"] = false;
            flags["flag02"] = true;
            k = 0;
        }
    }
    else if (flags["flag02"]) {
        loadPoseR(letr3D(p1, p2, k));
        k += speed;
        if (k>= 1.0) {
            flags["flag02"] = false;
            // flags["flag01"] = true;
            k = 0;
        }
    }
    return k;
}