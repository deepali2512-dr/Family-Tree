var user_id;
var INFO;
function getDetailsByMobileNumber(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value
    }
    $.post('php/getDetailsByMobileNumber.php', data_to_post, (res) => {
        if(res[0]) {
            console.log('founded');
            user_id = res[0].id;
            $('#start').hide();
            findTree();
        } else {
            console.log('not found');
            $('#start').hide();
            $('#add_user').show();
            $('#add_user')[0].mobile_number.value = form.mobile_number.value;
        }
        $('.ui.radio.checkbox').checkbox();
    });
    return false;
}

function addUser(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        gender: form.gender.value
    }
    console.log(data_to_post)
    $.post('php/addUser.php', data_to_post, (res) => {
        if(res) {
            console.log("Registered");
            getDetailsByMobileNumber(form);
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function addFather(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        user_id: INFO.self.id
    }
    $.post('php/addFather.php', data_to_post, (res) => {
        if(res) {
            findTree();
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function addMother(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        user_id: INFO.self.id,
        father_id: INFO.father.id
    }
    console.log(data_to_post);
    $.post('php/addMother.php', data_to_post, (res) => {
        if(res) {
            findTree();
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function addWife(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        user_id: INFO.self.id
    }
    console.log(data_to_post);
    $.post('php/addWife.php', data_to_post, (res) => {
        if(res) {
            findTree();
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function addHusband(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        user_id: INFO.self.id
    }
    console.log(data_to_post);
    $.post('php/addHusband.php', data_to_post, (res) => {
        if(res) {
            findTree();
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function addSibling(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        user_id: INFO.self.id,
        gender: form.gender.value,
        father_id: INFO.father.id
    }
    console.log(data_to_post);
    $.post('php/addSibling.php', data_to_post, (res) => {
        if(res) {
            findTree();
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function addChild(form) {
    var data_to_post = {
        mobile_number: form.mobile_number.value,
        name: form.name.value,
        user_id: INFO.self.id,
        spouse_id: INFO.spouse.id,
        user_gender: INFO.self.gender,
        gender: form.gender.value
    }
    $.post('php/addChild.php', data_to_post, (res) => {
        if(res) {
            findTree();
        } else {
            console.log("Not Registered");
        }
    });
    return false;
}

function findTree(id = user_id) {
    user_id = id;
    $("#add_father").hide();
    $("#add_mother").hide();
    $("#add_wife").hide();
    $("#add_husband").hide();
    $("#add_sibling").hide();
    $("#add_child").hide();
    $("#add_user").hide();
    $.get('php/findTree.php?id='+(user_id), (res) => {
        INFO = res;
        if(res.self) {
            $('.wrapper').show();
            generateTreeHTML(res);
        }
    });
}

function generateTreeHTML(res) {
    $("#user_name").html(res.self.name+'\'s Family')
    var ROOT = document.createElement('div');
    ROOT.className = 'tree';
    var FATHER = document.createElement('li');
    if(res.father) {
        FATHER.innerHTML = `<a href="#" onclick="findTree(${res.father.id})">${res.father.name}</a>`;
        if(res.mother) {
            FATHER.innerHTML += `<a href="#" onclick="findTree(${res.mother.id})">${res.mother.name}</a>`;
        } else {
            FATHER.innerHTML += `<a href="#" class="add" onclick="showAddMother()">Add Mother</a>`;
        }
    } else {
        FATHER.innerHTML = `<a href="#" class="add" onclick="showAddFather()">Add Father</a>`;
    }
    var ul = document.createElement('ul');
    ul.appendChild(FATHER);
    ROOT.appendChild(ul);
    var SELF = document.createElement('li');
    if(res.self) {
        SELF.innerHTML = `<a href="#" onclick="findTree(${res.self.id})">${res.self.name}</a>`;
        if(res.spouse) {
            SELF.innerHTML += `<a href="#" onclick="findTree(${res.spouse.id})">${res.spouse.name}</a>`;
        } else {
            if(INFO.self.gender == 'male') {
                SELF.innerHTML += `<a href="#" class="add" onclick="showAddWife()">Add Wife</a>`;
            } else {
                SELF.innerHTML += `<a href="#" class="add" onclick="showAddHusband()">Add Husband</a>`;
            }
        }
        ul = document.createElement('ul');
        ul.appendChild(SELF);
        if(res.siblings) {
            for (let i = 0; i < res.siblings.length; i++) {
                const sibling = res.siblings[i];
                var _SIBLING = document.createElement('li');
                _SIBLING.innerHTML = `<a href="#" onclick="findTree(${sibling.id})">${sibling.name}</a>`;
                ul.appendChild(_SIBLING);
            }
        }
        
        if(res.father) {
            var SIBLING = document.createElement('li');
            SIBLING.innerHTML = `<a href="#" class="add" onclick="showAddSibling()">Add Sibling</a>`;
            ul.appendChild(SIBLING);
        }
        
        FATHER.appendChild(ul);
    }
    if(res.spouse || res.children.length) {
        var ul = document.createElement('ul');
        for (let i = 0; i < res.children.length; i++) {
            const child = res.children[i];
            var CHILD = document.createElement('li');
            CHILD.innerHTML = `<a href="#" onclick="findTree(${child.id})">${child.name}</a>`;
            if(child.spouse) {
                CHILD.innerHTML += `<a href="#" onclick="findTree(${child.spouse.id})">${child.spouse.name}</a>`;
            }
            ul.appendChild(CHILD);
        }
        if(res.spouse) {
            var _CHILD = document.createElement('li');
            _CHILD.innerHTML = `<a href="#" class="add" onclick="showAddChild()">Add Child</a>`;
            ul.appendChild(_CHILD);
        }
        SELF.appendChild(ul);
    }
    $('.wrapper').html(ROOT);
    completeRemaining();
}

function completeRemaining() {
    // if(!INFO.self) {
    //     $('#add_user').show();
    // } else {
    //     $('#add_user').hide();
    // }
    // if(!INFO.father) {
    //     $("#add_father").show();
    //     return;
    // } else {
    //     $("#add_father").hide();
    // }
    // if(!INFO.mother) {
    //     $("#add_mother").show();
    //     return;
    // } else {
    //     $("#add_mother").hide();
    // }
}

function showAddFather() {
    $("#add_father").show();
    $("#add_mother").hide();
    $("#add_sibling").hide();
    $("#add_wife").hide();
    $("#add_husband").hide();
    $("#add_user").hide();
    $("#add_child").hide();
}
function showAddMother() {
    $("#add_father").hide();
    $("#add_mother").show();
    $("#add_sibling").hide();
    $("#add_wife").hide();
    $("#add_husband").hide();
    $("#add_user").hide();
    $("#add_child").hide();
}
function showAddWife() {
    $("#add_father").hide();
    $("#add_mother").hide();
    $("#add_sibling").hide();
    $("#add_wife").show();
    $("#add_husband").hide();
    $("#add_user").hide();
    $("#add_child").hide();
}
function showAddHusband() {
    $("#add_father").hide();
    $("#add_mother").hide();
    $("#add_sibling").hide();
    $("#add_wife").hide();
    $("#add_husband").show();
    $("#add_user").hide();
    $("#add_child").hide();
}
function showAddSibling() {
    $("#add_father").hide();
    $("#add_mother").hide();
    $("#add_sibling").show();
    $("#add_wife").hide();
    $("#add_husband").hide();
    $("#add_user").hide();
    $("#add_child").hide();
}
function showAddChild() {
    $("#add_father").hide();
    $("#add_mother").hide();
    $("#add_sibling").hide();
    $("#add_wife").hide();
    $("#add_husband").hide();
    $("#add_user").hide();
    $("#add_child").show();
}