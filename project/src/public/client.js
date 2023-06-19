const { Map, fromJS } = Immutable;

let store = Map({
  user: {
    name: 'Alexander Keil',
    desc: "I'm Software Developer at FJD Information Technologies in Munich, Germany",
    photo: './assets/img/ProfilFoto.jpg',
    posts: [
      'https://javascript.plainenglish.io/javascript-how-to-avoid-object-mutation-7cd733913a9f',
      'https://www.sonarsource.com/blog/es2023-new-array-copying-methods-javascript/',
      'https://betterprogramming.pub/7-tips-for-becoming-a-competent-javascript-developer-bc5b7a568287',
    ],
    linkedIn: 'https://www.linkedin.com/in/alexander-keil-1bb00b8b',
    linkedInLinkName: 'Alexander Keil',
  },
  apod: null,
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  selectedRover: '',
  selectedRoverData: null,
});

const root = document.getElementById('root');

const updateStore = (store, newState) => {
  const newStore = store.mergeDeep(newState);
  return newStore;
};

const render = async (root, state) => {
  const selectedRover = state.get('selectedRover');
  const apod = state.get('apod');

  if (selectedRover !== '') {
    const selectedRoverData = await getFetchedRoverData(selectedRover);
    const updatedState = state.set(
      'selectedRoverData',
      fromJS(selectedRoverData)
    );
    root.innerHTML = App(updatedState);
  } else if (apod === null) {
    root.innerHTML = `
      <div class="card">
        <p>Loading...</p>
      </div>
    `;
    await getImageOfTheDayData();
  } else {
    root.innerHTML = App(state);
  }
};

const App = (state) => {
  const rovers = state.get('rovers');

  return `
    <header>
      <h1>
        <img src="./assets/img/Mars.png" style="width: 32px; vertical-align: baseline"/>  
        Mars Dashboard
      </h1>
    </header>
    <div class="topnav">
      <nav>${Menu(rovers)}</nav>       
    </div>    
    <main>   
      </div>    
        <div class="row">
          <div class="leftcolumn">
            <div class="card">
              ${SelectedContent(state)}
            </div>
          </div>
        <div class="rightcolumn">
          ${RightSiteContent(state)}
        </div>
      </div>
    </main>
    <footer></footer>
  `;
};

window.addEventListener('load', () => {
  render(root, store);
});

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
  const apod = state.get('apod');
  const selectedRover = state.get('selectedRover');
  const selectedRoverData = state.get('selectedRoverData');
  if (selectedRover !== '') {
    const entriesSelectedRoverData = selectedRoverData?.getIn([
      'selectedRoverData',
      'latest_photos',
    ]);

    if (!entriesSelectedRoverData || entriesSelectedRoverData.size === 0) {
      return 'No photos available.';
    }

    const photos = entriesSelectedRoverData.toJS();

    return photos
      .map((photo, index) => {
        const isFirstLoop = index === 0;
        return PhotoCard(photo, isFirstLoop);
      })
      .join('');
  } else {
    return ImageOfTheDay(apod);
  }
};

const PhotoCard = (photo, isFirstLoop) => {
  const { img_src, earth_date, rover } = photo;
  const { name: roverName, landing_date, launch_date, status } = rover;

  if (isFirstLoop) {
    return `
      <div class="photocard">
        <h2>Latest Photos</h2>
        <div>
          <p><strong>Rover:</strong> ${roverName}</p>
          <p><strong>Landing Date:</strong> ${landing_date}</p>
          <p><strong>Launch Date:</strong> ${launch_date}</p>
          <p><strong>Status:</strong> ${status}</p>
          </br>
        </div>
        <img src="${img_src}" alt="Mars Rover Photo">
        <p>Earth Date: ${earth_date}</p>
      </div>
    `;
  }

  return `
    <div class="photocard">
      <img src="${img_src}" alt="Mars Rover Photo">
      <div>
        <p><strong>Earth Date:</strong> ${earth_date}</p>
      </div>
    </div>
  `;
};

const Menu = (rovers) => {
  const menuItems = ['Image of the day', ...rovers];

  return menuItems
    .map((item) => {
      if (item === 'Image of the day') {
        return '<a href="#" onclick="selectedImageOfTheDay(event)">Image of the day</a>';
      } else {
        return `<a href="#" onclick="selectedMenuItem(event, '${item}')">${item}</a>`;
      }
    })
    .join('');
};

window.selectedImageOfTheDay = async (event) => {
  event.preventDefault();
  const updatedStore = store
    .set('selectedRover', '')
    .set('selectedRoverData', null);
  render(root, updatedStore);
};

window.selectedMenuItem = async (event, rover) => {
  event.preventDefault();
  const selectedRoverData = await getFetchedRoverData(rover);
  const updatedStore = store
    .set('selectedRoverData', selectedRoverData)
    .set('selectedRover', rover);
  render(root, updatedStore);
};

const ImageOfTheDay = (apod) => {
  if (!apod) {
    return '<p>Loading...</p>';
  }

  if (apod.image.media_type === 'video') {
    return `
      <p>See today's featured video <a href="${apod.image.url}">here</a></p>
      <p>${apod.image.title}</p>
      <p>${apod.image.explanation}</p>
    `;
  } else if (apod.image) {
    const { title, date, url, explanation } = apod.image;
    return `
      <div class="row">
        <div class="column-left">
          <h2>${title}</h2>
          <h5>${date}</h5>
          <div>
            <img src="${url}" width="auto" />
          </div>
        </div>
        <div class="column-right">
          <p>${explanation}</p>
        </div>
      </div>
    `;
  }

  return '';
};

const RightSiteContent = (state) => {
  const user = state.get('user');
  return `
<div class="card">
  <h2>About Me</h2>
  <div class="side-menu" ><img class="circular_image fit" src="${user.photo}"/></div>
  <p>${user.desc}</p>
</div>
<div class="card">
  <h3>Popular Post</h3>
  <div class="side-menu"><a href="${user.posts[0]}">How to Avoid Object Mutation in JavaScript</a></div>
  <div class="side-menu"><a href="${user.posts[1]}">ES2023 introduces new array copying methods to JavaScript</a></div>
  <div class="side-menu"><a href="${user.posts[2]}">7 Tips for Becoming a Competent JavaScript Developer</a></div>
</div>
<div class="card">
  <h3>Follow Me on LinkedIn !</h3>
  <a href="${user.linkedIn}">${user.linkedInLinkName}</a>
</div>`;
};

const getImageOfTheDayData = async () => {
  try {
    const res = await fetch('http://localhost:3000/apod');
    const apod = await res.json();
    const updatedStore = store.set('apod', apod);
    render(root, updatedStore);
  } catch (error) {
    console.error('Error fetching image of the day:', error);
  }
};

const getFetchedRoverData = async (roverName) => {
  try {
    const res = await fetch(`http://localhost:3000/rover/${roverName}`);
    const selectedRoverData = await res.json();
    return fromJS(selectedRoverData);
  } catch (error) {
    console.error('Error fetching rover data:', error);
  }
};

window.addEventListener('load', () => {
  render(root, store);
  getImageOfTheDayData();
});
