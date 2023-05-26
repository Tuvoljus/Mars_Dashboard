// const { map } = require('./assets/js/rxjs.min');
// import { fromFetch } from 'rxjs/fetch';

let store = {
  user: { name: 'Student' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selectedRover: '',
};

// let store = Immutable.Map({
//   user: { name: 'Student' },
//   apod: '',
//   date: '',
//   rovers: ['Curiosity', 'Opportunity', 'Spirit'],
// });

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers, apod } = state;

  return `
        <header><h1>Mars Dashboard</h1>
        </header>  
        <div class="topnav">
       <nav>${Menu(rovers)}</nav>
       </div>
        <main>         
        <div class="row">
          <div class="leftcolumn">
            <div class="card">             
                ${SelectedContent(state)}             
            </div>          
          </div>
        <div class="rightcolumn">
          <div class="card">
            <h2>About Me</h2>
            <div class="fakeimg" style="height:100px;">Image</div>
            <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
          </div>
          <div class="card">
            <h3>Popular Post</h3>
            <div class="fakeimg"><p>Image</p></div>
            <div class="fakeimg"><p>Image</p></div>
            <div class="fakeimg"><p>Image</p></div>
          </div>
          <div class="card">
            <h3>Follow Me</h3>
            <p>Some text..</p>
          </div>
        </div>
      </div>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
          <h1>Welcome, ${name}!</h1>
      `;
  }

  return `
      <h1>Hello!</h1>
  `;
};

const SelectedContent = (state) => {
  if (state.selectedRover != '') {
    const photos = state.selectedRoverData.selectedRoverData;
    console.log(photos.latest_photos[0].camera.full_name, 'MAP FUC');
    console.log(photos.latest_photos[0].img_src, 'PATHS');
    return photos.latest_photos
      .map((photo, index) => {
        const isFirstLoop = index === 0;
        return `
        <div class="row">
          ${
            isFirstLoop
              ? `
            <div>
              <h2>Rover: ${photo.rover.name}</h2>   
              <h3>Some Information about the rover</h3>
              <ul>   
                <li>
                  Launch Date: ${photo.rover.launch_date}
                </li>
                <li>
                  Landing Date: ${photo.rover.landing_date}
                </li>
                <li>
                  Status: ${photo.rover.status}
                </li>   
              </ul> 
            </div>
            <div class="column-left">  
              <div class="fit">   
                <img src="${photo.img_src}" width="auto" />
              </div>
            </div> 
            <div class="column-right">  
              <h3>About the Photo</h3>     
              <ul> 
                <li>
                  Camera Name: ${photo.camera.name}
                </li>
                <li>
                  Photo taken on: ${photo.earth_date}
                </li>
              </ul>
            </div>
          `
              : `
            <div class="column-left">  
              <div class="fit">   
                <img src="${photo.img_src}" width="auto" />
              </div>
            </div> 
            <div class="column-right">  
              <h3>About the Photo</h3>     
              <ul> 
                <li>
                  Camera Name: ${photo.camera.name}
                </li>
                <li>
                  Photo taken on: ${photo.earth_date}
                </li>
              </ul>
            </div>
          `
          }
        </div>
      `;
      })
      .join('');
  } else {
    return ImageOfTheDay(store.apod);
  }
};

const Menu = (menuItems) => {
  return menuItems.map((menuItem) => {
    return `    
        <a href="#" id="${menuItem}" onclick="selectedMenueItem(${menuItem})">${menuItem}</a>   
    `;
  });
};

function selectedMenueItem(menueItem) {
  const selectedRover = menueItem.id;
  console.log(selectedRover, 'my selection');
  updateStore(store, { selectedRover });
  getFetchedRoverData(selectedRover);
  SelectedContent();
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(photodate.getDate(), today.getDate());

  console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
          <p>See today's featured video <a href="${apod.url}">here</a></p>
          <p>${apod.title}</p>
          <p>${apod.explanation}</p>
      `;
  } else {
    return `    
    <div class="row">
    <div class="column-left">
   <h2>${apod.image.title}</h2>
    <h5>${apod.image.date}</h5>
    <div class="fit ">   
           <img src="${apod.image.url}" width="auto" />
           </div>
          </div> 
           <div class="column-right">
          <p>${apod.image.explanation}</p>
          </div>
          </div>
      `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  // return data;
};

const getFetchedRoverData = (roverName) => {
  fetch(`http://localhost:3000/rover/${roverName}`)
    .then((res) => res.json())
    .then((selectedRoverData) => {
      // const latestPhotos = selectedRoverData.latest_photos;
      updateStore(store, { selectedRoverData });
      // console.log(latestPhotos, 'FROM FETCH');
    });
};
