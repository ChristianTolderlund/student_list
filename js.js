"use strict";
window.addEventListener("load", setup);

let students;
let families;

let filteredStudents;
let allStudents = [];
let expelledStudents = [];


const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  bloodStatus: "",
  image: "",
  house: "",
  gender: "",
  bloodStatus: "",
  inquisitorial: false,
  id: 0,
  expelled: false,
  prefect: false,
};

function setup() {
  // Close pop up when X is clicked
  document.querySelector(".close").addEventListener("click", closePopUp);

  // Show dropdown content when dropdown is clicked
  document.querySelector(".dropdown_house").addEventListener("click", () => {
    document.querySelector(".dropdown-content").classList.toggle("flex");
  });
  document.querySelector(".dropdown_status").addEventListener("click", () => {
    document.querySelector(".dropdown-content_status").classList.toggle("flex");
  });

  // Hide dropdown when there is clicked outside of it
  document.addEventListener("mouseup", function (e) {
    const container = document.querySelector(".dropdown-content");
    if (!container.contains(e.target)) {
      container.classList.remove("flex");
    }
  });
  document.addEventListener("mouseup", function (e) {
    const container_status = document.querySelector(".dropdown-content_status");
    if (!container_status.contains(e.target)) {
      container_status.classList.remove("flex");
    }
  });

  // Filters diff. houses  when button elements are clicked.
  let allHouseOptions = document.querySelectorAll(".house_filter");
  allHouseOptions.forEach((option) => {
    option.addEventListener("click", filterHouse);
  });
  // Filter when button elements are clicked.
  let allStatusOptions = document.querySelectorAll(".status_filter");
  allStatusOptions.forEach((statusOption) => {
    statusOption.addEventListener("click", filterStatus);
  });

  // Sort when elements are clicked.
  let allThElements = document.querySelectorAll("th");
  allThElements.forEach((ThElement) => {
    ThElement.addEventListener("click", sort);
  });
  // Search for student
  document.querySelector("#clear_btn").addEventListener("click", () => {
    document.querySelector("#search_input").value = "";
  });
  document.querySelector("#search_input").addEventListener("input", searchStudent);
  document.querySelector("#total_enrolled").textContent = `34 students are enrolled`;

  getStudents();
}

// Gets the json data
async function getStudents() {
  const url1 = "https://petlatkea.dk/2021/hogwarts/students.json";
  let data = await fetch(url1);
  students = await data.json();
  updateObjects(students);
  getFamilies();
}

async function getFamilies() {
  const url2 = "https://petlatkea.dk/2021/hogwarts/families.json";
  let data = await fetch(url2);
  families = await data.json();
  getBloodStatus(families);
}

function getBloodStatus(families) {
  allStudents.forEach((student, index) => {
    if (families.half.includes(student.lastName)) {
      student.bloodStatus = "half-blood";
    } else if (families.pure.includes(student.lastName)) {
      student.bloodStatus = "pure-blood";
    } else {
      student.bloodStatus = "muggle";
    }
    console.log(student);
  });
}

function sort(ThElement) {
  let direction = 1;

  let sortBy = ThElement.target.dataset.sort;
  let orderBy = ThElement.target.getAttribute("data-sort-direction");

  if (orderBy === "asc") {
    ThElement.target.dataset.sortDirection = "desc";
  } else {
    ThElement.target.dataset.sortDirection = "asc";
  }

  if (orderBy === "asc") {
    direction = 1;
  } else {
    direction = -1;
  }

  console.log(sortBy);
  console.log(orderBy);

  filteredStudents.sort(compareProperty);
  displayList(filteredStudents);

  function compareProperty(a, b) {
    if (a[sortBy] < b[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
}

function filterStatus(statusOption) {
  let filterChoice = statusOption.target.getAttribute("data-filter");

  if (expelledStudents.length === 0 && filterChoice === "Expelled") {
    document.querySelector("#error").style.display = "block";
    document.querySelector("#error h2").innerHTML = "No students have been expelled";
  } else {
    document.querySelector("#error").style.display = "none";
  }

  if (allStudents.filter((student) => student.prefect).length === 0 && filterChoice === "Prefect") {
    document.querySelector("#error").style.display = "block";
    document.querySelector("#error h2").innerHTML = "No students have been marked as prefects";
  } else {
    document.querySelector("#error").style.display = "none";
  }

  if (filterChoice === "*") {
    filteredStudents = allStudents;
  } else if (filterChoice === "Expelled") {
    filteredStudents = expelledStudents;
  } else if (filterChoice === "Inquisitorial") {
    filteredStudents = allStudents.filter((studentInfo) => studentInfo.inquisitorial);
  } else if (filterChoice === "Prefect") {
    filteredStudents = allStudents.filter((student) => student.prefect);
  }

  displayList(filteredStudents);
}

function filterHouse(option) {
  let filterChoice = option.target.getAttribute("data-filter");
  console.log(filterChoice);

  if (filterChoice != "*") {
    filteredStudents = allStudents.filter(studentHouse);
  } else {
    filteredStudents = allStudents;
  }

  console.log(allStudents.filter(studentHouse));

  function studentHouse(studentInfo) {
    if (studentInfo.house === filterChoice) {
      return true;
    } else {
      return false;
    }
  }

  displayList(filteredStudents);
}

function displayListInformation() {
    console.log("displayListInformation");
  
    // Number of students in each house:
    document.querySelector("#gryff_total").textContent = allStudents.filter((student) => student.house === "Gryffindor").length;
    document.querySelector("#slyth_total").textContent = allStudents.filter((student) => student.house === "Slytherin").length;
    document.querySelector("#huff_total").textContent = allStudents.filter((student) => student.house === "Hufflepuff").length;
    document.querySelector("#raven_total").textContent = allStudents.filter((student) => student.house === "Ravenclaw").length;
  
    // Number of expelled and enrolled students:
    document.querySelector("#total_expelled").textContent = `${expelledStudents.length} Students are expelled`;
    document.querySelector("#total_enrolled").textContent = `${allStudents.length} Students are still enrolled`;
  }

function updateObjects(students) {
  filteredStudents = allStudents;
  students.forEach((jsonObject, i) => {
    const studentInfo = Object.create(Student);
    studentInfo.id = i;

    const getfullName = jsonObject.fullname.trim();


    let checkName = getfullName.match(/\b\w+\b/g);
    const getFirstName = checkName[0];
    const getMiddleName = checkName[1];
    const getLastName = checkName[2];

    const firstName = getFirstName.charAt(0).toUpperCase() + getFirstName.substring(1).toLowerCase();

    studentInfo.firstName = firstName;

    if (checkName.length === 2) {
      studentInfo.lastName = checkName[1].charAt(0).toUpperCase() + checkName[1].slice(1).toLowerCase();

      studentInfo.middleName = "";
    } else if (checkName.length === 3) {
      studentInfo.lastName = checkName[2].charAt(0).toUpperCase() + checkName[2].slice(1).toLowerCase();

      studentInfo.middleName = getMiddleName.charAt(0).toUpperCase() + getMiddleName.slice(1);
    } else {
      studentInfo.lastName = "";
      studentInfo.middleName = "";
    }

    if (getfullName.includes('"')) {
      studentInfo.nickName = getfullName.substring(getfullName.indexOf('"') + 1, getfullName.lastIndexOf('"'));
    } else if (getfullName.includes("-")) {
      studentInfo.lastName = getfullName.substring(getfullName.indexOf("-") - 5);
      studentInfo.middleName = "";
      studentInfo.nickName = "undefined";
    } else {
      studentInfo.nickName = "undefined";
    }

    if (checkName.length === 1) {
      studentInfo.image = `images/${getFirstName.toLowerCase()}_${getFirstName.charAt(0).toLowerCase()}.png`;
    } else if (checkName.length === 2) {
      studentInfo.image = `images/${getMiddleName.toLowerCase()}_${getFirstName.charAt(0).toLowerCase()}.png`;
    } else {
      studentInfo.image = `images/${getLastName.toLowerCase()}_${getFirstName.charAt(0).toLowerCase()}.png`;
    }

    // Remove spaces from house names
    const houseRemoveSpace = jsonObject.house.replace(/ /g, "");

    const house = houseRemoveSpace.charAt(0).toUpperCase() + houseRemoveSpace.substring(1).toLowerCase();

    studentInfo.house = house;

    studentInfo.gender = jsonObject.gender;


    allStudents.push(studentInfo);
  });
  displayList(allStudents);
}

function displayList(allStudents) {
  document.querySelector("#students_list tbody").innerHTML = "";

  allStudents.forEach(displayStudent);
  displayListInformation();
}

function displayStudent(studentInfo) {

  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstname]").textContent = studentInfo.firstName;
  clone.querySelector("[data-field=lastname]").textContent = studentInfo.lastName;
  clone.querySelector("[data-field=house]").textContent = studentInfo.house;

  clone.querySelector("[data-field=firstname]").addEventListener("click", () => showDetails(studentInfo));
  clone.querySelector("[data-field=lastname]").addEventListener("click", () => showDetails(studentInfo));
  
  if (studentInfo.prefect) {
    clone.querySelector("[data-field=prefect]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = "☆";
  }
  if (studentInfo.inquisitorial) {
    clone.querySelector("[data-field=inquisitorial]").textContent = "🟥";
  } else {
    clone.querySelector("[data-field=inquisitorial]").textContent = "⬜️";
  }

  clone.querySelector("[data-field=inquisitorial]").addEventListener("click", () => assignToInquisitorial(studentInfo));
  clone.querySelector("[data-field=prefect]").addEventListener("click", () => assignAsPrefect(studentInfo));

  document.querySelector("#students_list tbody").appendChild(clone);

  return studentInfo;
}

function assignAsPrefect(studentInfo) {
  console.log(studentInfo);
  if (studentInfo.prefect) {
    studentInfo.prefect = false;
  } else {
    addStudentAsPrefect(studentInfo);
  }

  displayList(filteredStudents);
}

function addStudentAsPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const otherPrefect = prefects.filter((student) => student.house === selectedStudent.house);

  if (otherPrefect.length >= 2) {
    alert("There can only be 2 prefects per house");
    prefects.shift();
  } else {
    selectedStudent.prefect = true;
    prefects.push(selectedStudent);
  }
  console.log("prefects", prefects);
}

function assignToInquisitorial(studentInfo) {
  if (studentInfo.inquisitorial) {
    studentInfo.inquisitorial = false;
  } else {
    addToStudentInquisitorial(studentInfo);
  }

  displayList(filteredStudents);
}

function addToStudentInquisitorial(selectedStudent) {
  const inquisitors = allStudents.filter((studentInfo) => studentInfo.inquisitorial);

  if (selectedStudent.bloodStatus != "pure-blood" && selectedStudent.house != "Slytherin") {
    alert("Only pure-blood students or students from Slytherin can be added");
    inquisitors.shift();
  } else {
    selectedStudent.inquisitorial = true;
    inquisitors.push(selectedStudent);
  }
  console.log(inquisitors);
}

function closePopUp() {
  document.querySelector(".pop_up").style.display = "none";
  document.querySelector("#total_expelled").textContent = `${expelledStudents.length} students have been expelled so far`;
  document.querySelector("#total_enrolled").textContent = `${allStudents.length} students are still enrolled`;
  displayListInformation();
}

function displayMessage(details) {
  const message = document.querySelector("#messeage_popup");
  message.className = "cta show";
  document.querySelector("#messeage").textContent = `${details.firstName} ${details.lastName} has been succesfully expelled!`;

  setTimeout(removeMessage, 3000);

  function removeMessage() {
    message.className = "cta hide";
  }
}

function showDetails(details) {
  document.querySelector(".pop_up").style.display = "block";
  window.scrollTo(0, 0);

  document.querySelector(".pop_up").querySelector("#fullname").textContent = details.firstName + " " + details.middleName + " " + details.lastName;
  document.querySelector(".pop_up").querySelector("#gender").textContent = details.gender;
  document.querySelector(".pop_up").querySelector("#house").textContent = details.house;
  document.querySelector(".pop_up").querySelector("#blood").textContent = details.bloodStatus;
  document.querySelector(".pop_up").querySelector("img").src = details.image;

  if (details.house === "Gryffindor") {
    document.querySelector("#house_crest").src = "emblem/griffindor-emblem.png";
  } else if (details.house === "Slytherin") {
    document.querySelector("#house_crest").src = "emblem/slytherin-emblem.png";
  } else if (details.house === "Hufflepuff") {
    document.querySelector("#house_crest").src = "emblem/hufflepuff-emblem.png";
  } else {
    document.querySelector("#house_crest").src = "emblem/ravenclaw-emblem.png";
  }
  document
  .querySelector(".pop_up")
  .querySelector("img")
  .addEventListener("error", function handleError() {
    const defaultImage = "images/assets/default.png";

    document.querySelector(".pop_up").querySelector("img").src = defaultImage;
    document.querySelector(".pop_up").querySelector("img").alt = "default";
  });

  // Hide dropdown content if user clicks outside of it
  document.addEventListener("mouseup", function (e) {
    const popUpContainer = document.querySelector(".popup_content");
    if (!popUpContainer.contains(e.target)) {
      closePopUp();
    }
  });

  document.querySelector("#expel_btn").addEventListener("click", expelStudent);

  function expelStudent() {
    document.querySelector("#expel_btn").removeEventListener("click", expelStudent);
    displayMessage(details);

    const studentToBeExpelled = (element) => element.id === details.id;

    const indexOfStudentToExpel = allStudents.findIndex(studentToBeExpelled);

    expelledStudents.push(allStudents[indexOfStudentToExpel]);

    allStudents.splice(indexOfStudentToExpel, 1);

    console.log("expelledStudents", expelledStudents);
    console.log("object:", details);
    displayList(allStudents);
    closePopUp(expelledStudents);
  }

  checkStatus(details);

  return details;
}

function checkStatus(selectedStudent) {
    // let studentDetails = showDetails(info);
    console.log("Student Details:", selectedStudent);
  
    // Check status of selected student
    if (expelledStudents.includes(selectedStudent)) {
      document.querySelector("#exp").style.backgroundColor = "#71CCA8";
    } else {
      document.querySelector("#exp").style.backgroundColor = " ";
    }
  
    if (allStudents.filter((selectedStudent) => selectedStudent.prefect).includes(selectedStudent)) {
      document.querySelector("#pre").style.backgroundColor = "#71CCA8";
    } else {
      document.querySelector("#pre").style.backgroundColor = " ";
    }
  
    if (allStudents.filter((selectedStudent) => selectedStudent.inquisitorial).includes(selectedStudent)) {
      document.querySelector("#ins").style.backgroundColor = "#71CCA8";
    } else {
      document.querySelector("#ins").style.backgroundColor = " ";
    }
  }

function searchStudent(evt) {
  console.log("searchStudent");

  const inputVal = document.querySelector("#search_input").value;

  // write to the list with only those elemnts in the allAnimals array that has properties containing the search frase
  displayList(
    allStudents.filter((elm) => {
      // comparing in uppercase so that m is the same as M
      return elm.firstName.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.lastName.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.house.toUpperCase().includes(evt.target.value.toUpperCase());
    })
  );
}