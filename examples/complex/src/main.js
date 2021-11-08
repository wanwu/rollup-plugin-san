import san from 'san';
import sanApp from './App.san';
import './global.css';

// export default App;

var App = san.defineComponent(sanApp);
var app = new App();
app.attach(document.getElementById('app'));