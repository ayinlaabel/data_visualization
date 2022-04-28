function onLoad() {
  // alert(1)
  fetch("http://localhost:8080/", {
    method: "GET",
    headers: { "Content-type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      s = document.querySelector(".start");
      e = document.querySelector(".end");

      s.setAttribute("min", data.m);
      e.setAttribute("min", data.m);
      s.setAttribute("max", data.x);
      e.setAttribute("max", data.x);
    });
}

myFunction = () => {
  let startDate = document.querySelector(".start").value;
  let endDate = document.querySelector(".end").value;
  let form = {
    startDate,
    endDate,
  };
  // formData.append("form", form);
  let t = JSON.stringify(form);
  let formData = new FormData();
  formData.append('startDate', startDate)
  formData.append('endDate', endDate)
  // alert(JSON.stringify(formData));
  // alert(t);
  fetch("http://localhost:8080/form", {
    // body: JSON.stringify(form),
    body: formData,
    method: "POST",
    headers:{
      "Content-Type":"application/json",
      Accept: "application/json"
    }
  }).then((res) => console.log(res));
};
