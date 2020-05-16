var base_url = "https://api.football-data.org/v2/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getArticles() {
  if ("caches" in window) {
    caches.match(base_url + "competitions/2021/standings")
    .then( response => {
      if (response) {
        response.json().then( data => {
          let articlesHTML = "";
          let standings = data.standings[0];
            articlesHTML += `
              <div class="col s12 m12">
              <div class="card">
              <div class="card-content">
              
              
              <h5 class="center-align">EPL Clasement</h5>
              <table class="highlight responsive-table">
                <thead>
                  <tr>
                    <th class="center-align">Position</th>
                    <th >Club</th>
                    <th class="center-align">Badge</th>
                    <th class="center-align">Play</th>
                    <th class="center-align">Won</th>
                    <th class="center-align">Draw</th>
                    <th class="center-align">lost</th>
                    <th class="center-align">Points</th>
                    <th class="center-align">club detail</th>
                  </tr>
                </thead>
                <tbody>
            `;
            standings.table.forEach( table =>{
            articlesHTML+=`
                <tr>
                  <td class="center-align">${table.position}</td>
                  <td>${table.team.name}</td>
                  <td class="center-align">
                    <img src="${table.team.crestUrl}" alt="${table.team.name}" class="circle responsive-img" style="max-height:24px;" >
                  </td>
                  <td class="center-align">${table.playedGames}</td>
                  <td class="center-align">${table.won}</td>
                  <td class="center-align">${table.draw}</td>
                  <td class="center-align">${table.lost}</td>
                  <td class="center-align">${table.points}</td>
                  <td class="center-align">
                    <a class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">pageview</i></a>
                  </td>
                </tr>`;
            })
            articlesHTML+=`
                </tbody>
              </table>

              </div>
              </div>
              </div>
              `;

          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetch(base_url + "competitions/2021/standings", {
    headers: {
      'X-Auth-Token':'750e305a325b468dae03f086c8916e59'
    }
  })
  .then(status)
  .then(json)
  .then( data => {
    // Objek/array JavaScript dari response.json() masuk lewat data.

    // Menyusun komponen card artikel secara dinamis
    let articlesHTML = "";
    let standings = data.standings[0];
      articlesHTML += `
        <div class="col s12 m12">
        <div class="card">
        <div class="card-content">
        
        
        <h5 class="center-align">EPL Clasement</h5>
        <table class="highlight responsive-table">
          <thead>
            <tr>
              <th class="center-align">Position</th>
              <th >Club</th>
              <th class="center-align">Badge</th>
              <th class="center-align">Play</th>
              <th class="center-align">Won</th>
              <th class="center-align">Draw</th>
              <th class="center-align">lost</th>
              <th class="center-align">Points</th>
              <th class="center-align">club detail</th>
            </tr>
          </thead>
          <tbody>
      `;
      standings.table.forEach( table =>{
      articlesHTML+=`
          <tr>
            <td class="center-align">${table.position}</td>
            <td>${table.team.name}</td>
            <td class="center-align">
              <img src="${table.team.crestUrl}" alt="${table.team.name}" class="circle responsive-img" style="max-height:24px;" >
            </td>
            <td class="center-align">${table.playedGames}</td>
            <td class="center-align">${table.won}</td>
            <td class="center-align">${table.draw}</td>
            <td class="center-align">${table.lost}</td>
            <td class="center-align">${table.points}</td>
            <td class="center-align">
              <a class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">pageview</i></a>
            </td>
          </tr>`;
      })
      articlesHTML+=`
          </tbody>
        </table>

        </div>
        </div>
        </div>
        `;

    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("articles").innerHTML = articlesHTML;
  })
  .catch(error);
  
}

function getArticleById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "article/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var articleHTML = `
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${data.result.cover}" />
                </div>
                <div class="card-content">
                  <span class="card-title">${data.result.post_title}</span>
                  ${snarkdown(data.result.post_content)}
                </div>
              </div>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
            
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + "article/" + idParam)
      .then(status)
      .then(json)
      .then(function(data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var articleHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
              </div>
            </div>
          `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
        
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedArticles() {
  getAll().then(function(articles) {
    console.log(articles);
    // Menyusun komponen card artikel secara dinamis
    var articlesHTML = "";
    articles.forEach(function(article) {
      var description = article.post_content.substring(0,100);
      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.ID}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.post_title}</span>
                      <p>${description}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = articlesHTML;
  });
}

function getSavedArticleById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function(article) {
    articleHTML = '';
    var articleHTML = `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${article.cover}" />
      </div>
      <div class="card-content">
        <span class="card-title">${article.post_title}</span>
        ${snarkdown(article.post_content)}
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.get(id);
      })
      .then(function(article) {
        resolve(article);
      });
  });
}