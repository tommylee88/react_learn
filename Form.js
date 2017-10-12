import React, {Component} from 'react';
import Validation from 'react-validation';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';

//import "../validation.js";
import Form from 'react-validation/build/form';
import validator from 'validator';

const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return 'required';
  }
};
 
const email = (value) => {
  if (!validator.isEmail(value)) {
    return `${value} is not a valid email.`
  }
};
 
const lt = (value, props) => {
  // get the maxLength from component's props
  if (!value.toString().trim().length > props.maxLength) {
    // Return jsx
    return <span className="error">The value exceeded {props.maxLength} symbols.</span>
  }
};
 
const password = (value, props, components) => {
  // NOTE: Tricky place. The 'value' argument is always current component's value.
  // So in case we're 'changing' let's say 'password' component - we'll compare it's value with 'confirm' value.
  // But if we're changing 'confirm' component - the condition will always be true
  // If we need to always compare own values - replace 'value' with components.password[0].value and make some magic with error rendering.
  if (value !== components['confirm'][0].value) { // components['password'][0].value !== components['confirm'][0].value
    // 'confirm' - name of input
    // components['confirm'] - array of same-name components because of checkboxes and radios
    return <span className="error">Passwords are not equal.</span>
  }
};

export default class Registration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            msg: '',
            password: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        var data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }
        console.log("inside handle submit")
        
        console.log(data)
        fetch("/users/new", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            console.log(data)    
            if(data === "success"){
               this.setState({msg: "Thanks for registering"});  
            }
        }).catch(function(err) {
            console.log(err)
        });
    }

    logChange(e) {
        this.setState({[e.target.name]: e.target.value});  
    }

    render() {
        return (
            <div className="container register-form">
                <Form onSubmit={this.handleSubmit} method="POST">
                    <h3>Register</h3>
                    <div>
                        <label>
                            Email*
                            <Input value='email@email.com' name='email' validations={[required, email]}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Password*
                            <Input type='password' name='password' validations={[required]}/>
                        </label>
                    </div>
                    <div>
                        <Button>Submit</Button>
                    </div>
                </Form>
            </div>
        );
    }
}
// <Form onSubmit={this.handleSubmit} method="POST">
// <label>Name</label>
// <Input onChange={this.logChange} className="form-control" value='' placeholder='John' name='name'/>
// <label>Email</label>
// <Input value='email@email.com' name='email' validations={[required, email]}/>

// <div className="submit-section">
//     <Button className="btn btn-uth-submit">Submit</Button>
// </div>
// </Form>
