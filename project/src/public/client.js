// const { map } = require('./assets/js/rxjs.min');
// import { fromFetch } from 'rxjs/fetch';

// let store = {
//   user: { name: 'Student' },
//   apod: '',
//   rovers: ['Curiosity', 'Opportunity', 'Spirit'],
//   selectedRover: '',
// };

let store = Immutable.Map({
  user: { name: 'Student' },
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selectedRover: '',
  // selectedRoverData: [],
});

console.log(store, 'MY STORE');
// add our markup to the page
const root = document.getElementById('root');

// const updateStore = (store, newState) => {
//   store = Object.assign(store, newState);
//   render(root, store);
// };

const updateStore = (store, newState) => {
  store = store.merge(newState);
  // const newStore = store.merge(newState);
  render(root, store);
  // return store; // Return the new store object
};

// const updateStore = (store, newState) => {
//   const newStore = store.merge(newState);
//   render(root, newStore); // Pass the new store object to the render function
//   return newStore; // Return the new store object
// };

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// const render = async (root, state) => {
//   const { apod, selectedRoverData } = state;
//   root.innerHTML = App(apod, selectedRoverData);
// };

// create content
// const App = (state) => {
//   let apod = state.get('apod');
//   console.log(state, 'State in App');
//   let rovers = state.get('rovers');

//   return `
//         <header><h1>Mars Dashboard</h1>
//         </header>
//         <div class="topnav">
//        <nav>${Menu(rovers)}</nav>
//        </div>
//         <main>
//         <div class="row">
//           <div class="leftcolumn">
//             <div class="card">
//                 ${SelectedContent(state)}
//             </div>
//           </div>
//         <div class="rightcolumn">
//           <div class="card">
//             <h2>About Me</h2>
//             <div class="fakeimg" style="height:100px;">Image</div>
//             <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
//           </div>
//           <div class="card">
//             <h3>Popular Post</h3>
//             <div class="fakeimg"><p>Image</p></div>
//             <div class="fakeimg"><p>Image</p></div>
//             <div class="fakeimg"><p>Image</p></div>
//           </div>
//           <div class="card">
//             <h3>Follow Me</h3>
//             <p>Some text..</p>
//           </div>
//         </div>
//       </div>
//         </main>
//         <footer></footer>
//     `;
// };

const App = (state) => {
  const rovers = state.get('rovers');
  const SelRovers = state.get('selectedRover');
  console.log(SelRovers, 'selected Rovers in App');
  return `
    <header>
      <h1>Mars Dashboard</h1>
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
  console.log(state, 'MY STORE');
  // const selectedRover = store.get('selectedRover');
  // const selectedRoverData = store.get('selectedRoverData');
  // console.log(selectedRover, 'Selected Rover in SelectedContent');
  // const { selectedRover, selectedRoverData, apod } = state;

  const apod = state.get('apod');

  const selectedRover = state.get('selectedRover');
  const selectedRoverData = state.get('selectedRoverData');
  console.log(apod, 'APOD');
  console.log(selectedRoverData, 'SelectedRoverData');
  console.log(selectedRover, 'selectedRover in SelectedContent');
  if (selectedRover !== '') {
    console.log(selectedRoverData, 'selectedRoverData');

    if (selectedRoverData === undefined) {
      return 'Loading...';
    }
    const roverData = state.get('selectedRoverData');
    // const photos = roverData.selectedRoverData;

    // const photos =
    //   roverData && roverData.selectedRoverData.latest_photos
    //     ? roverData.selectedRoverData.latest_photos
    //     : [];
    const photos = roverData.selectedRoverData.latest_photos;
    console.log(photos, 'Here I AM');
    // const photos = selectedRoverData.get('latest_photos');

    console.log(photos, 'Photos');
    return photos
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
    return ImageOfTheDay(state.get('apod'));
  }
};

const Menu = (menuItems) => {
  console.log(menuItems, 'MENU ITEMS');
  return menuItems.map((menuItem) => {
    return `    
        <a href="#" id="${menuItem}" onclick="selectedMenuItem(${menuItem})">${menuItem}</a>   
    `;
  });
};

// function selectedMenuItem(menueItem) {
//   const selectedRover = menueItem.id;
//   console.log(selectedRover, 'my selection');
//   // updateStore(store, { selectedRover });
//   updateStore(store, Immutable.Map({ selectedRover: selectedRover }));
//   // getFetchedRoverData(selectedRover);
//   getFetchedRoverData(selectedRover.toString()); // Convert selectedRover to a string using toString()
//   SelectedContent();
// }

//Meins => uncomment
function selectedMenuItem(menuItem) {
  // const selectedRover = menuItem.toString(); // Convert the menu item to a string
  const selectedRover = menuItem.innerHTML;
  console.log(selectedRover, 'my selection');
  updateStore(store, { selectedRover });
  getFetchedRoverData(selectedRover);
  // SelectedContent(store); // Pass the store as an argument to SelectedContent
}

// ChatGPT
// async function selectedMenuItem(menuItem) {
//   const selectedRover = menuItem.id;
//   console.log(selectedRover, 'my selection');

//   const selectedRoverData = await getFetchedRoverData(selectedRover);
//   updateStore(store, { selectedRover, selectedRoverData });

//   render(root, store);
// }

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);

  if (!apod || apod.date === today.getDate() || !apod.image) {
    getImageOfTheDay(store);
  }

  if (apod.media_type === 'video') {
    return `
      <p>See today's featured video <a href="${apod.url}">here</a></p>
      <p>${apod.title}</p>
      <p>${apod.explanation}</p>
    `;
  } else if (apod.image) {
    return `
      <div class="row">
        <div class="column-left">
          <h2>${apod.image.title}</h2>
          <h5>${apod.image.date}</h5>
          <div class="fit">
            <img src="${apod.image.url}" width="auto" />
          </div>
        </div>
        <div class="column-right">
          <p>${apod.image.explanation}</p>
        </div>
      </div>
    `;
  }

  return '';
};

// const ImageOfTheDay = (apod) => {
//   // If image does not already exist, or it is not from today -- request it again
//   const today = new Date();
//   const photodate = new Date(apod.date);
//   console.log(photodate.getDate(), today.getDate());

//   console.log(photodate.getDate() === today.getDate());
//   if (!apod || apod.date === today.getDate()) {
//     getImageOfTheDay(store);
//   }

//   // check if the photo of the day is actually type video!
//   if (apod.media_type === 'video') {
//     return `
//           <p>See today's featured video <a href="${apod.url}">here</a></p>
//           <p>${apod.title}</p>
//           <p>${apod.explanation}</p>
//       `;
//   } else {
//     return `
//     <div class="row">
//     <div class="column-left">
//    <h2>${apod.image.title}</h2>
//     <h5>${apod.image.date}</h5>
//     <div class="fit ">
//            <img src="${apod.image.url}" width="auto" />
//            </div>
//           </div>
//            <div class="column-right">
//           <p>${apod.image.explanation}</p>
//           </div>
//           </div>
//       `;
//   }
// };

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  // return data;
};

// const getFetchedRoverData = (roverName) => {
//   fetch(`http://localhost:3000/rover/${roverName}`)
//     .then((res) => res.json())
//     .then((selectedRoverData) => {
//       const latestPhotos = selectedRoverData.latest_photos;
//       updateStore(store, { latestPhotos });
//       console.log(latestPhotos, 'FROM FETCH');
//     });
// };

const getFetchedRoverData = (roverName) => {
  fetch(`http://localhost:3000/rover/${roverName}`)
    .then((res) => res.json())
    .then((selectedRoverData) => {
      // const latestPhotos = selectedRoverData.latest_photos;
      updateStore(store, { selectedRoverData });
      console.log(selectedRoverData, 'FROM FETCH');
    });
};

// {
//   "latest_photos": [
//       {
//           "id": 660735,
//           "sol": 5111,
//           "camera": {
//               "id": 17,
//               "name": "PANCAM",
//               "rover_id": 6,
//               "full_name": "Panoramic Camera"
//           },
//           "img_src": "https://mars.nasa.gov/mer/gallery/all/1/p/5111/1P581919922EFFD2FCP2682L8M1-BR.JPG",
//           "earth_date": "2018-06-11",
//           "rover": {
//               "id": 6,
//               "name": "Opportunity",
//               "landing_date": "2004-01-25",
//               "launch_date": "2003-07-07",
//               "status": "complete"
//           }
//       }
//   ]
// }

// [
//   {
//     id: 1148682,
//     sol: 3857,
//     camera: {
//       id: 20,
//       name: 'FHAZ',
//       rover_id: 5,
//       full_name: 'Front Hazard Avoidance Camera',
//     },
//     img_src:
//       'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03857/opgs/edr/fcam/FLB_739899607EDR_F1011606FHAZ00302M_.JPG',
//     earth_date: '2023-06-13',
//     rover: {
//       id: 5,
//       name: 'Curiosity',
//       landing_date: '2012-08-06',
//       launch_date: '2011-11-26',
//       status: 'active',
//     },
//   },
// ];
