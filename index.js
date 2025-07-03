document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("caseForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const audioFile = document.getElementById("audioEvidence").files[0];
      const imageFiles = document.getElementById("imageEvidence").files;
      let audioData = null;
      let imageData = [];

      if (audioFile) {
        const audioReader = new FileReader();
        audioReader.onload = function (e) {
          audioData = {
            name: audioFile.name,
            type: audioFile.type,
            data: e.target.result,
          };
          processImages();
        };
        audioReader.readAsDataURL(audioFile);
      } else {
        processImages();
      }

      function processImages() {
        if (imageFiles.length > 0) {
          let processedCount = 0;

          for (let i = 0; i < imageFiles.length; i++) {
            const imageReader = new FileReader();
            imageReader.onload = function (e) {
              imageData.push({
                name: imageFiles[i].name,
                type: imageFiles[i].type,
                data: e.target.result,
              });
              processedCount++;

              if (processedCount === imageFiles.length) {
                saveReport(audioData, imageData);
              }
            };
            imageReader.readAsDataURL(imageFiles[i]);
          }
        } else {
          saveReport(audioData, imageData);
        }
      }

      function saveReport(audioData, imageData) {
        const report = {
          title: document.getElementById("title").value,
          context: document.getElementById("context").value,
          textArea: document.getElementById("textArea").value,
          audioEvidence: audioData,
          imageEvidence: imageData,
        };
        const reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push(report);
        localStorage.setItem("reports", JSON.stringify(reports));

        alert("report submitted sucessfully");
        document.getElementById("caseForm").reset();

        displayReports();
      }
    });
});

function displayReports() {
  const reports = JSON.parse(localStorage.getItem("reports") || "[]");

  const reportList = document.getElementById("previousReports");
  reportList.innerHTML = "";

  reports.forEach((report, index) => {
    const reportItem = document.createElement("div");

    let audiohtml = "";
    if (report.audioEvidence) {
      audiohtml = `<p><strong>Audio Evidence: </strong></p>
            <audio controls>
            <source src="${report.audioEvidence.data}" type="${report.audioEvidence.type}">
            Your browser does not support the audio element.
            </audio>
            <p>File: ${report.audioEvidence.name}`;
    }

    let imageHtml = "";
    if (report.imageEvidence && report.imageEvidence.length > 0) {
      imageHtml = `<p><strong>Image Evidence:</strong></p><div>`;
      report.imageEvidence.forEach((image, imgIndex) => {
        imageHtml += `<div>
                <img src="${image.data}" alt="Evidence"/>
                <p>${image.name}</p>
                </div>`;
      });
      imageHtml += `</div>`;
    }

    reportItem.innerHTML = `
        <div>
        <h3>Report #${index + 1}</h3>
        <p>title: ${report.title}</p>
        <p>context: ${report.context}</p>
        <p>description: ${report.textArea}</p>
        ${audiohtml}
        ${imageHtml}`;
    reportList.appendChild(reportItem);
  });
}

displayReports();

function clearReports() {
  localStorage.removeItem("reports");
  displayReports();
  alert("All reports cleared");
}
