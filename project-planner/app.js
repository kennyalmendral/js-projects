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

		element.scrollIntoView({
			behavior: 'smooth'
		});
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
	constructor(closeNotifierFunction, text, hostElementId) {
		super(hostElementId);

		this.closeNotifier = closeNotifierFunction;
		this.text = text;
		this.create();
	}

	create() {
		const tooltipElement = document.createElement('div');

		tooltipElement.className = 'card tooltip';

		const tooltipTemplate = document.getElementById('tooltip');
		const tooltipBody = document.importNode(tooltipTemplate.content, true);

		tooltipBody.querySelector('p').textContent = this.text;

		tooltipElement.append(tooltipBody);

		const hostElementPositionLeft = this.hostElement.offsetLeft;
		const hostElementPositionTop = this.hostElement.offsetTop;
		const hostElementHeight = this.hostElement.clientHeight;
		const parentElementScrolling = this.hostElement.parentElement.scrollTop;

		const x = hostElementPositionLeft + 20;
		const y = hostElementPositionTop + (hostElementHeight - parentElementScrolling - 10);

		tooltipElement.style.position = 'absolute';
		tooltipElement.style.left = x + 'px';
		tooltipElement.style.top = y + 'px';

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
		this.connectDrag();
	}

	showMoreInfoHandler() {
		if (this.hasActiveTooltip)
			return;

		const projectElement = document.getElementById(this.id);
		const tooltipText = projectElement.dataset.extraInfo;

		const tooltip = new Tooltip(
			() => {
				this.hasActiveTooltip = false;
			}, 
			tooltipText,
			this.id
		);

		tooltip.attach();

		this.hasActiveTooltip = true;
	}

	connectMoreInfoButton() {
		const projectItemElement = document.getElementById(this.id);
		const moreInfoButton = projectItemElement.querySelector('button:first-of-type');

		moreInfoButton.addEventListener('click', this.showMoreInfoHandler.bind(this));
	}

	connectDrag() {
		const item = document.getElementById(this.id);

		item.addEventListener('dragstart', event => {
			event.dataTransfer.setData('text/plain', this.id);
			event.dataTransfer.effectAllowed = 'move';
		});

		item.addEventListener('dragend', event => {
			console.log(event);
		});
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

		this.connectDroppable();
	}

	connectDroppable() {
		const list = document.querySelector(`#${this.type}-projects ul`);

		list.addEventListener('dragenter', event => {
			if (event.dataTransfer.types[0] === 'text/plain') {
				list.parentElement.classList.add('droppable');

				event.preventDefault();
			}
		});

		list.addEventListener('dragover', event => {
			if (event.dataTransfer.types[0] === 'text/plain')
				event.preventDefault();
		});

		list.addEventListener('dragleave', event => {
			if (event.relatedTarget.closest && event.relatedTarget.closest(`#${this.type}-projects ul`) !== list)
				list.parentElement.classList.remove('droppable');
		});

		list.addEventListener('drop', event => {
			event.preventDefault();

			const projectId = event.dataTransfer.getData('text/plain');

			if (this.projects.find(project => project.id == projectId))
				return;

			document.getElementById(projectId).querySelector('button:last-of-type').click();

			list.parentElement.classList.remove('droppable');
		});
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
