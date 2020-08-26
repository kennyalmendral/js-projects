import { ProjectItem as Item } from './ProjectItem';
import * as DOMH from '../Utility/DOMHelper';

export class ProjectList {
	// projects = [];

	constructor(type) {
		this.type = type;

		this.projects = [];

		const projectItems = document.querySelectorAll(`#${type}-projects li`);

		for (const projectItem of projectItems) {
			this.projects.push(new Item(projectItem.id, this.switchProject.bind(this), this.type));
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

		DOMH.moveElement(project.id, `#${this.type}-projects ul`);

		project.update(this.switchProject.bind(this), this.type);
	}

	switchProject(projectId) {
		/*const projectIndex = this.projects.findIndex(project => project.id == projectId);
		this.projects.splice(projectIndex, 1);*/

		this.switchHandler(this.projects.find(project => project.id === projectId));

		this.projects = this.projects.filter(project => project.id !== projectId);
	}
}