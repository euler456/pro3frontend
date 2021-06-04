import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import TextField from '@material-ui/core/TextField';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
//import Redirect from 'react-router'
//import { fetchlogin, fetchregister,fetchaccountexists ,fetchisloggedin,fetchlogout } from './api/app/app.js';
//"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir="C:\tmp"
import {
  Route,
  NavLink,
  HashRouter,
  Redirect ,
  BrowserRouter,
  Router
} from "react-router-dom";
const green = '#e8f5e9';
const black = '#424242';


class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = { color: green };
    this.changeColor = this.changeColor.bind(this);
    this.Logout = this.Logout.bind(this);
  }
  changeColor(){
    const newColor = this.state.color == green ? black : green;
    this.setState({ color: newColor })
  }
  Logout=()=>{
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=adminlogout', 
    {
        method: 'GET',
        credentials: 'include'
    })
    .then((headers) =>{
        if(headers.status != 200) {
            console.log('logout failed Server-Side, but make client login again');
        }
        else{
        localStorage.removeItem('csrf');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('postcode');
        localStorage.removeItem('CustomerID');    
        alert("logout already");}
        
    })
    .catch(function(error) {console.log(error)});
  }
  render() {

    return (
      <div style={{background: this.state.color}}>
      <HashRouter>
      <div class="container">
        <h1 >Freshly Login</h1>
        <ul id="header" class="row">
          <li><NavLink to="/" class="col">Login</NavLink></li>
          <li><NavLink to="/Home" class="col ">Food</NavLink></li>
          <li><NavLink to="/User" class="col ">User</NavLink></li>
          <li><NavLink to="/Setting" class="col ">Setting</NavLink></li>
          <li><NavLink to="/" class="col" onClick={this.Logout}>Logout</NavLink></li>
          <li class="col "> <button id="dark" class="btn btn-light" onClick={this.changeColor}>Darkmode</button></li>
        </ul>
        <div id="content">
           <Route exact path="/" component={Login}/>
           <Route exact path="/Home" component={Home}/>
           <Route exact path="/User" component={User}/>
           <Route path="/Sign" component={Sign}/>
           <Route path="/Setting" component={Setting}/>
           <Route path="/password" component={password}/>
        </div>
        </div>
        
        </HashRouter>
        </div>
    );
  }
}

class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.fetchfooddelete = this.fetchfooddelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      hits: [],
      redirect: false,
      order:[]
    };
  }
  handleupdate(event){
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=updatefood', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })   .then((headers) =>{
      if(headers.status == 400) {
          console.log('updatefood failed');
          alert('You are not loggin');
          return;
      }
      if(headers.status == 201) {
          console.log('updatefood successful');
          window.location.reload();
          return;
      }
  })
  .catch(function(error) {console.log(error)});
  }
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=addfood', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })   .then((headers) =>{
      if(headers.status == 400) {
          console.log('addfood failed');
          alert('You are not loggin');
          return;
      }
      if(headers.status == 201) {
          console.log('addfood successful');
          window.location.reload();
          return;
      }
  })
  .catch(function(error) {console.log(error)});
  }
  fetchfooddelete= (dd)=>{
    console.log(dd);
    const fd = new FormData();
    fd.append('F_ID', dd);
    console.log(fd);
   fetch('https://ux2backend.herokuapp.com/api/api.php?action=deleteFOOD', 
   {
       method: 'POST',
       body: fd,
       credentials: 'include'
   })
   .then(function(headers) {
       if(headers.status == 400) {
           console.log('can not delete');
           return;
       }
    
       if(headers.status == 201) {
           console.log('delete succussful');
           window.location.reload();
           return;
       }
   })
   .catch(function(error) {console.log(error)});
     }
  componentDidMount() {
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=displayfood',
    {
            method: 'POST',
            credentials: 'include'
        }
        )   .then(response => response.json())
        .then(data => this.setState({ hits: data }));
    }
  render(){
    const { hits } = this.state; 
          return (
            <body>
            <form>
            <table>
            <thead>
                <th>Name</th>
                <th>image</th>
                <th>Price</th>
                <th>Quantity</th>
            </thead>
            <tbody id="orderform">
                  {hits.map(hit =>(
            <tr>
            <td class='fd-id'>{hit.F_ID}</td>
            <td class='fd-name'>{hit.foodname}</td>
            <td ><img src={require(`./pic/${hit.image}.jpg`).default}></img></td>
            <td class='price'>{hit.price}</td>
            <td>{hit.options}</td>
            <td><Button variant="contained" color="primary"
        style={{ display: 'inline-block' }} type="submit" name="delete" value="delete"  onClick={() =>this.fetchfooddelete(`${hit.F_ID}`)}>Delete</Button></td>
            </tr> ) )}
            </tbody>
        </table>
        </form>
        <form  onSubmit={this.handleSubmit}>
          <h4>Add Food</h4>
        <TextField type="text" name="foodname" variant="filled"
        color="primary" label="foodname"
        style={{ margin: 10 ,display: 'inline-block' }}  id="foodname"  required></TextField>

        <TextField type="number" name="price" variant="filled"
        color="primary" label="price"
        style={{ margin: 10 ,display: 'inline-block' }} id="price"  required></TextField>
   
        <TextField type="text" name="description" variant="filled"
        color="primary" label="description"
        style={{ margin: 10 ,display: 'inline-block' }} id="description"  required></TextField>
       
        <TextField type="text" name="options"variant="filled"
        color="primary" label="options"
        style={{ margin: 10 ,display: 'inline-block' }}  id="options" required></TextField>
     
        <TextField type="text" name="image" variant="filled"
        color="primary" label="image"
        style={{ margin: 10 ,display: 'inline-block' }} id="image" value="gruel" required></TextField>
        <Button type="submit" variant="contained" color="primary">Add food</Button>
       </form>


       
       <form onSubmit={this.handleupdate}>
         <h4>Update food</h4>
           
            <TextField type="number" name="F_ID" variant="filled"
        color="primary" label="FoodID"
        style={{ margin: 10 ,display: 'inline-block' }} id="F_ID2"   required></TextField>

            <TextField type="text" name="foodname" variant="filled"
        color="primary" label="foodname"
        style={{ margin: 10 ,display: 'inline-block' }} id="foodname2"  required></TextField>
      
            <TextField type="number" name="price" variant="filled"
        color="primary" label="price"
        style={{ margin: 10 ,display: 'inline-block' }} id="price2"  required></TextField>
         
            <TextField type="text" name="description" variant="filled"
        color="primary" label="description"
        style={{ margin: 10 ,display: 'inline-block' }} id="description2"  required></TextField>
            <TextField type="text" name="options" variant="filled"
        color="primary" label="options"
        style={{ margin: 10 ,display: 'inline-block' }} id="options2"  required></TextField>
      
            <TextField type="text" name="image" variant="filled"
        color="primary" label="image"
        style={{ margin: 10 ,display: 'inline-block' }} id="image2" value="gruel" required></TextField>
            <Button type="submit" variant="contained" color="primary">update</Button>
        </form>
        </body>
          );
  }
  
}



class Login extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      redirect: false
    };
    
  }
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=adminlogin', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    }) .then((headers)=> {
      if(headers.status == 401) {
          console.log('login failed');
          localStorage.removeItem('csrf');
          localStorage.removeItem('username');
          localStorage.removeItem('phone');
          localStorage.removeItem('email');
          localStorage.removeItem('postcode');
          localStorage.removeItem('CustomerID');

          alert('Can not login')
          return;
      }
      if(headers.status == 203) {
          console.log('registration required');
          // only need csrf
      }
      if(headers.status == 200) {
        console.log('login successful');
        this.setState({ redirect: true });

        // only need csrf
    }

  
  })
  .catch(function(error) {
      console.log(error)
  });
  }
  render() {
    const { redirect } = this.state;
    // const { redirectToReferrer } = this.state;
     if (redirect) {
       return <Redirect to='/Home'/>
     }
    return (
      <Formik
      initialValues={{
        username: '',
        password: ''
    }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
        .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
        .max(40)
        .required('username is required'),
          password: Yup.string()
          .required('Password is required')
  })}
  render={({ errors, touched }) => (
      <Form onSubmit={this.handleSubmit}>
          <div className="form-group">
              <label htmlFor="username">username</label>
              <Field name="username" id="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
              <ErrorMessage name="username" component="div" className="invalid-feedback" />
          </div>
          <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" id="password" type="password"  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
          </div>
          <div className="form-group">
          <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,marginRight: 10,display: 'inline-block' }}>login</Button>
            <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,display: 'inline-block' }}>
        <NavLink to="/Sign" id="Signup">Sign Up</NavLink> </Button>
          </div>
      </Form>
  )}
/>
    

    );
  }
}


class Sign extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value: '',
      redirect: false
    };
    
  }
  onChange(evt) {
    this.setState({
      value: evt.target.value.replace(/[^a-zA-Z]/g, '')
    });
 };
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=registeradmin', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })   .then((headers) =>{
      if(headers.status == 418) {
          console.log('user exists');
          //this.setState({ redirectToReferrer: false});
          alert("username exists");
          return;
      }
   
      if(headers.status == 201) {
          console.log('registration updated');
          this.setState({ redirect: true });
          return;
      }
     
  })
  .catch(function(error) {console.log(error)});
  }
  render() {
    const { redirect } = this.state;
   // const { redirectToReferrer } = this.state;
    if (redirect) {
      return <Redirect to='/' />
    }
    return (
      <div>
         <h1>Sign Up</h1>
         <form  onSubmit={this.handleSubmit}>
             <TextField type="text" name="username" onChange={this.onChange.bind(this)} value={this.state.value} id="regusername" variant="filled"
        color="primary"   label="username"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
            
              <TextField type="email" name="email"  id="regemail"   variant="filled"
        color="primary"  label="email"
        style={{ margin: 10 ,display: 'inline-block' }}required></TextField>
 
              <TextField type="text" name="phone"  id="regphone"  variant="filled"
        color="primary" label="phone"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
            
              <TextField type="number" name="postcode"  id="regpostcode" variant="filled"
        color="primary" label="postcode"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
             
              <TextField type="password" name="password" placeholder="password" id="regpassword"  variant="filled"
        color="primary" label="password"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
              <TextField type="password" name="password2" placeholder="password again" id="regpassword2"  variant="filled"
        color="primary" label="confirm password"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
              <Button type="submit" variant="contained" color="primary"
        style={{ marginTop: 10,marginRight: 300,display: 'inline-block' }}>Register</Button>
       </form>
      </div>
    );
  }
}

class Setting extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      value: '',
      redirect: false
    };
  }
  onChange(evt) {
    this.setState({
      value: evt.target.value.replace(/[^a-zA-Z]/g, '')
    });
 };
 
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.history.push('/');
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=adminupdate', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })    .then(function(headers) {
      if(headers.status == 400) {
          console.log('username exists');
          alert('update failed');
          return;
      }
   
      if(headers.status == 201) {
          console.log(' updated');
          alert('update successful');   
          this.setState({ redirect: true });
          return;
      }
     
  })
  .catch(function(error) {console.log(error)});
  }
  render() {
    const { redirect } = this.state;
   // const { redirectToReferrer } = this.state;
    if (redirect) {
      return <Redirect to='/' />
    }
    return (
      <div >
         <h1>Edit My profile</h1>
         <div>
      </div>
      <form onSubmit={this.handleSubmit}>
              <TextField type="hidden" name="currentusername"  id="currentusername" required hidden></TextField>
              <h4> username</h4>
              <TextField type="text" name="username"  id="upusername"  onChange={this.onChange.bind(this)} value={this.state.value} required></TextField>
              <h4> email</h4>
              <TextField type="email" name="email"  id="upemail" required></TextField>
              <h4> phone</h4>
              <TextField type="number" name="phone"  id="upphone"  required></TextField>
              <h4> postcode</h4>
              <TextField type="number" name="postcode"  id="uppostcode" required></TextField>
              <h4> password</h4>
              <TextField type="password" name="password" placeholder="password" id="uppassword" required></TextField>
              <h4>re-password</h4>
              <TextField type="password" name="password2" placeholder="password again" id="uppassword2"  required></TextField>
             
              <TextField type="submit" name="submit"></TextField>
       </form>
      </div>
    );
  }
}
class password extends React.Component {
  render() {
    return (
      <div>
         <h4>New password</h4>
            <TextField type="password" name="password" placeholder="password"
               id="regpass"  required></TextField>     <br /> 
                <h4>Confirm password</h4>
              
            <TextField type="password" name="Confirm" placeholder="Confirm password"
               id="Confirm"  required></TextField>  <br />   
                <button name="subject" type="submit" id="fat-btn" class="btn btn-success" >Save</button>
        </div>

    );
  }
}


class User extends React.Component {
  constructor(props) {
    super(props);
    this.fetchuserdelete = this.fetchuserdelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      hitss: [],
      redirect: false,
      order:[]
    };
  }
  onChange(evt) {
    this.setState({
      value: evt.target.value.replace(/[^a-zA-Z]/g, '')
    });
 };
  handleupdate(event){
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=updateuser', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })   .then((headers) =>{
      if(headers.status == 400) {
          console.log('updateuser failed');
          alert('You are not loggin');
          return;
      }
      if(headers.status == 201) {
          console.log('updateuser successful');
          window.location.reload();
          return;
      }
  })
  .catch(function(error) {console.log(error)});
  }
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=adduser', {
      method: 'POST',
      credentials: 'include',
      body: data
      
    })   .then((headers) =>{
      if(headers.status == 400) {
          console.log('adduser failed');
          alert('You are not loggin');
          return;
      }
      if(headers.status == 201) {
          console.log('adduser successful');
          window.location.reload();
          return;
      }
  })
  .catch(function(error) {console.log(error)});
  }
  fetchuserdelete= (dd)=>{
    console.log(dd);
    const fd = new FormData();
    fd.append('CustomerID', dd);
    console.log(fd);
   fetch('https://ux2backend.herokuapp.com/api/api.php?action=deleteuser', 
   {
       method: 'POST',
       body: fd,
       credentials: 'include'
   })
   .then(function(headers) {
       if(headers.status == 400) {
           console.log('can not delete');
           return;
       }
       if(headers.status == 201) {
           console.log('delete succussful');
           window.location.reload();
           return;
       }
   })
   .catch(function(error) {console.log(error)});
     }
  componentDidMount() {
    fetch('https://ux2backend.herokuapp.com/api/api.php?action=displayuser',
    {
            method: 'POST',
            credentials: 'include'
        }
        )   .then(response => response.json())
        .then(data => this.setState({ hitss: data }));
    }
  render(){
    const { hitss } = this.state; 
          return (
            <body>
            <form>
            <table>
            <thead>
                <th>CustomerID</th>
                <th>name</th>
                <th>email</th>
                <th>phone</th>
                <th>postcode</th>
            </thead>
            <tbody id="orderform">
                  {hitss.map(hit =>(
            <tr>
            <td class='fd-id'>{hit.CustomerID}</td>
            <td class='fd-name'>{hit.username}</td>
            <td class='fd-email'>{hit.email}</td>
            <td class='fd-phone'>{hit.phone}</td>
            <td class='fd-postcode'>{hit.postcode}</td>
            <td class='fd-usertype'>{hit.usertype}</td>
            </tr> ) )}
            </tbody>
        </table>
        </form>
        <form  onSubmit={this.handleSubmit}>
        <h4> Add User</h4>
             <TextField type="text" name="username" onChange={this.onChange.bind(this)} value={this.state.value} id="regusername" 
             variant="filled"
             color="primary"   label="username"
             style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
          
              <TextField type="email" name="email"  id="regemail"  variant="filled"
        color="primary"   label="email"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
           
              <TextField type="text" name="phone"  id="regphone" variant="filled"
        color="primary"   label="phone"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
            
              <TextField type="number" name="postcode"  id="regpostcode"  variant="filled"
        color="primary"   label="postcode"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
            
              <TextField type="password" name="password" placeholder="password" id="regpassword"  variant="filled"
        color="primary"   label="password"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField>
        
              <TextField type="usertype" name="usertype"  id="usertype" variant="filled"
        color="primary"   label="usertype"
        style={{ margin: 10 ,display: 'inline-block' }} required></TextField> 
        <Button type="submit" variant="contained" color="primary">Add User</Button>
       </form>
       <form onSubmit={this.handleupdate}>
       <h4> CustomerID</h4>
       <h4> Update Customer</h4>
       <TextField type="number" name="CustomerID" variant="filled"
        color="primary"   label="CustomerID"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField>
             <TextField type="text" name="username" onChange={this.onChange.bind(this)} value={this.state.value} id="regusername" variant="filled"
        color="primary"   label="username"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField>
           
              <TextField type="email" name="email"  id="regemail" variant="filled"
        color="primary"   label="email"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField>
           
              <TextField type="text" name="phone"  id="regphone" variant="filled"
        color="primary"   label="phone"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField>
    
              <TextField type="number" name="postcode"  id="regpostcode"  variant="filled"
        color="primary"   label="postcode"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField>
          
              <TextField type="password" name="password" placeholder="password" id="regpassword"  variant="filled"
        color="primary"   label="password"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField>
              <TextField type="usertype" name="usertype"  id="usertype" variant="filled"
        color="primary"   label="usertype"
        style={{ margin: 10 ,display: 'inline-block' }}  required></TextField> 
        <Button type="submit" variant="contained" color="primary">Update User</Button>
        </form>
        </body>
          );
  }
}
ReactDOM.render(
 <BrowserRouter><Main/></BrowserRouter>, 
  document.getElementById('root')
);
 
export default Main;