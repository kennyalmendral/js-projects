class DOMHelper {
	static clearEventListeners(element) {
		const clonedElement = element.cloneNode(true);

		element.replaceWith(clonedElement);

		return clonedElement;
	}

	static moveElement(elementId, newDestinationSelector) {
		const element = document.getElementById(elementId);
		const destinationElement = document.querySelector(newDestinationSelector);

		destinationElement.append(element);
	}
}

class Component {
	constructor(hostElementId, insertBefore = false) {
		if (hostElementId) {
			this.hostElement = document.getElementById(hostElementId);
		} else {
			this.hostElement =  document.body;
		}

		this.insertBefore = insertBefore;
	}

	detach() {
		if (this.element)
			this.element.parentElement.removeChild(this.element);
	}

	attach() {
		this.hostElement.insertAdjacentElement(
			this.insertBefore ? 'afterbegin' : 'beforeend',
			this.element
		);
	}
}

class Tooltip extends Component {
	constructor(closeNotifierFunction, tooltipText) {
		super();

		this.closeNotifier = closeNotifierFunction;
		this.tooltipText = tooltipText;
		this.create();
	}

	create() {
		const tooltipElement = document.createElement('div');

		tooltipElement.className = 'card tooltip';
		tooltipElement.textContent = this.tooltipText;
		tooltipElement.addEventListener('click', this.closeTooltip);

		this.element = tooltipElement;
	}

	closeTooltip = () => {
		this.detach();
		this.closeNotifier();
	}
}

class ProjectItem {
	hasActiveTooltip = false;

	constructor(id, updateProjectListsFunction, type) {
		this.id = id;
		this.updateProjectListsHandler = updateProjectListsFunction;

		this.connectMoreInfoButton();
		this.connectSwitchButton(type);
	}

	showMoreInfoHandler(tooltipText) {
		if (this.hasActiveTooltip)
			return;

		const tooltip = new Tooltip(() => {
			this.hasActiveTooltip = false;
		}, tooltipText);

		tooltip.attach();

		this.hasActiveTooltip = true;
	}

	connectMoreInfoButton() {
		const projectItemElement = document.getElementById(this.id);
		const moreInfoButton = projectItemElement.querySelector('button:first-of-type');
		const tooltipText = projectItemElement.getAttribute('data-extra-info');

		moreInfoButton.addEventListener('click', this.showMoreInfoHandler.bind(this, tooltipText));
	}

	connectSwitchButton(type) {
		const projectItemElement = document.getElementById(this.id);

		let switchButton = projectItemElement.querySelector('button:last-of-type');

		switchButton = DOMHelper.clearEventListeners(switchButton);

		switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
		switchButton.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
	}

	update(updateProjectListsFunction, type) {
		this.updateProjectListsHandler = updateProjectListsFunction;

		this.connectSwitchButton(type);
	}
}

class ProjectList {
	projects = [];

	constructor(type) {
		this.type = type;

		const projectItems = document.querySelectorAll(`#${type}-projects li`);

		for (const projectItem of projectItems) {
			this.projects.push(new ProjectItem(projectItem.id, this.switchProject.bind(this), this.type));
		}

		console.log(this.projects);
	}

	setSwitchHandlerFunction(switchHandlerFunction) {
		this.switchHandler = switchHandlerFunction;
	}

	addProject(project) {
		this.projects.push(project);

		DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);

		project.update(this.switchProject.bind(this), this.type);
	}

	switchProject(projectId) {
		/*const projectIndex = this.projects.findIndex(project => project.id == projectId);
		this.projects.splice(projectIndex, 1);*/

		this.switchHandler(this.projects.find(project => project.id === projectId));

		this.projects = this.projects.filter(project => project.id !== projectId);
	}
}

class App {
	static init() {
		const activeProjectsList = new ProjectList('active');
		const finishedProjectsList = new ProjectList('finished');

		activeProjectsList.setSwitchHandlerFunction(
			finishedProjectsList.addProject.bind(finishedProjectsList)
		);

		finishedProjectsList.setSwitchHandlerFunction(
			activeProjectsList.addProject.bind(activeProjectsList)
		);
	}
}

App.init();
