import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

// Component imports
import Register from './component/Register';
import Login from './component/Login';
import Home from './component/Home';
import Recruit from './component/Recruit';

function App() {
  return (
    
    //Browser router - used for client side routing within the app 
    <BrowserRouter> 
      <Switch>
        <Route exact path="/">
          <Redirect to="/login"/> { /* Redirects the app to /login */ }
        </Route>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home}/>
        <Route exact path="/view/:job_id" component={Recruit}/>
      </Switch>
    </BrowserRouter>

  );
}

export default App;
