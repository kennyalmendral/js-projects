import CMP from './Component';

export class Tooltip extends CMP {
	constructor(closeNotifierFunction, text, hostElementId) {
    super(hostElementId);

		this.closeNotifier = closeNotifierFunction;
		this.text = text;

		this.closeTooltip = () => {
			this.detach();
			this.closeNotifier();
		}

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
}