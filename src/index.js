import React from "react"
import PropTypes from "prop-types"
import ReactDOM from "react-dom"
import { init } from "contentful-ui-extensions-sdk"
import update from 'immutability-helper';
import ReactQuill,{Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import "./index.scss"


const initialData = {
		content:'',
		headline:''	
}

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  }
constructor(props){
	super(props)
	if(!this.props.sdk.field.getValue()){
		this.state = initialData
	}else{
		this.state=this.props.sdk.field.getValue()
	}
}
  

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()
	// Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    //this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange)

  }
  componentWillUnmount() {
	  //need to add this or onExternal Change will keep nesting value objects in state
    //this.detachExternalChangeHandler()
  }
  
   handleStateChange =(target,newState)=>{
	   //console.log(newState)
	   const updatedState = update(
		   this.state,{
			   [target]:{$set:newState}
		   }
	   )	  
	   this.setState(updatedState,this.saveValues)
	   
   }
  saveValues=()=>{
	  this.props.sdk.field.setValue(this.state)
  }
   onExternalChange = value => {
    //this.setState({ value })
  }
    bubbleModules = {
		toolbar: [
			['bold', 'italic', {'script':'super'}],
			['clean']
		    ],
	  }
	snowModules = {
		toolbar: [
			['bold', 'italic','blockquote', {'script':'super'}],
			 [{ 'size': ['small', false,]}],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			['link','clean']
		    ],
	  }
  render = () => {
      return ( 
	      <>
			<ReactQuill 
		  		name="content-headline"
		  		id="content-headline" 
		  		value={this.state.headline||''}
		  		placeholder="Add your headline..."
		  		onChange={(value)=>this.handleStateChange('headline',value)} 
		  		modules={this.bubbleModules}
		  		theme='bubble'
		  		/>
			<ReactQuill 
		  		name="content-body"
		  		id="content-body" 
		  		value={this.state.content||''}
		  		placeholder="Add your content..."
		  		onChange={(value)=>this.handleStateChange('content',value)} 
		  		modules={this.snowModules}
		  		theme='snow'
		  		/>

		  	</>
  		)
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"))
})

if (module.hot) {
  module.hot.accept()
}
