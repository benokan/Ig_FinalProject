
// function loadFile(fileName, jData) {
//     var fileLoader = new THREE.FileLoader();
//     fileLoader.load(
//         // resource URL
//         fileName,
//         // onLoad callback
//         function (data) {
//             // output the text to the console
//             jData = JSON.parse(data);
            
//         },
//         // onProgress callback
//         function (xhr) {
//             console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//         },
//         // onError callback
//         function (err) {
//             console.error('An error happened');
//         }
//     );
// }


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


// When we download the pose as .json it contains objects 
// Via this function we're parsing it to arrays to benefit Quaternion class's proto function fromArray.

// usage : jsonToArray(yourPoseHere)
// output : length(yourPoseHere)*positions -> positions contain 4 elements in another array -> [_x, _y, _z, _w]