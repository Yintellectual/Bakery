const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"

var root = "/api";
var dev_check = "05021752";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {cakes: [], specs: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}



	// tag::follow-2[]
	loadFromServer(pageSize) {
		follow(client, root, [
			{ rel: 'cakes', params: { size: pageSize } }]
		).then(cakeCollection => {
			return client({
				method: 'GET',
				path: cakeCollection.entity._links.profile.href,
				headers: { 'Accept': 'application/schema+json' }
			}).then(schema => {
				this.schema = schema.entity;
				return cakeCollection;
			});
		}).done(cakeCollection => {
			
			console.log("====0502:schema=====\n");
			console.log(JSON.stringify(this.schema));
			console.log("====================\n");
			console.log("====0502:schema.properties=====\n");
			console.log(JSON.stringify(this.schema.properties));
			console.log("===============================\n");
			console.log("====0502:Object.keys(schema.properties)=====\n");
			console.log(JSON.stringify(Object.keys(this.schema.properties)));
			console.log("============================================\n");
			
			this.setState({
				cakes: cakeCollection.entity._embedded.cakes,
				specs: this.schema.properties,
				pageSize: pageSize,
				links: cakeCollection.entity._links
			});
		});
	}
	// end::follow-2[]

	// tag::create[]
	onCreate(newCake) {
		follow(client, root, ['cakes']).then(cakeCollection => {
			return client({
				method: 'POST',
				path: cakeCollection.entity._links.self.href,
				entity: newCake,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'cakes', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	// end::create[]


	// tag::delete[]
	onDelete(cake) {
		client({method: 'DELETE', path: cake._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}
	// end::delete[]

	// tag::navigate[]
	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(cakeCollection => {
			this.setState({
				cakes: cakeCollection.entity._embedded.cakes,
				specs: this.state.specs,
				pageSize: this.state.pageSize,
				links: cakeCollection.entity._links
			});
		});
	}
	// end::navigate[]

	// tag::update-page-size[]
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}
	// end::update-page-size[]

	// tag::follow-1[]
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}
	// end::follow-1[]



	render() {
		return (
			<div>
				<CreateDialog specs={this.state.specs} onCreate={this.onCreate}/>
				<CakeList cakes={this.state.cakes}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  onNavigate={this.onNavigate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

class CakeList extends React.Component {
	
	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}
	
	
	// tag::handle-page-size-updates[]
	handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}
	// end::handle-page-size-updates[]

		// tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}
	// end::handle-nav[]
	
		// tag::cake-list-render[]
	render() {
		const cakes = this.props.cakes.map(cake =>
			<Cake key={cake._links.self.href} cake={cake} onDelete={this.props.onDelete}/>
		);

		const navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<table>
					<tbody>
						<tr>
							<th>Photo</th>
							<th>Tags</th>
							<th></th>
						</tr>
						{cakes}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
	// end::cake-list-render[]
}

class Cake extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}
	handleDelete() {
		this.props.onDelete(this.props.cake);
	}
	render() {
		return (
			<tr>
				<td>{this.props.cake.photo}</td>
				<td>{this.props.cake.tags}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}



class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleTagChange = this.handleTagChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		
	}


	handleSubmit(e) {
		e.preventDefault();
		const newCake = {};
		this.props.attributes.forEach(attribute => {
			newCake[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newCake);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}
	
	

	render() {
		const inputs = Object.keys(this.props.specs).map((key, index)=>{
			let attribute;
			attribute = key;
			console.log("====0502:key====\n");
			console.log(key);
			console.log("================\n");
			console.log("====0502:this.props.specs[key]====\n");
			console.log(this.props.specs[key]);
			console.log("==================================\n");
			console.log("====0502:this.props.specs[key].type====\n");
			console.log(this.props.specs[key].type);
			console.log("=======================================\n");
			if(this.props.specs[key].type == "array"){
				console.log("====0502:if====\n");
				console.log("type is array");
				console.log("===============\n");
				return (<StringArrayInput spec={this.props.specs[key]}/>);
			}else{
				console.log("====0502:else====\n");
				console.log("type is string");
				console.log("=================\n");
				return (<p key={key}>
					<input type="text" placeholder={key} ref={key} className="field" />
				</p>);
			}
		});

		return (
			<div>
				<a href="#createCake">Create</a>

				<div id="createCake" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new Cake</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)