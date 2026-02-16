import { TopbarHeader } from '../common/index.js';
import { PimEmployeeList, PimAddEmployee, PimPersonalDetails } from './index.js';
import { ConfirmDeleteModal } from '../modal-windows/index.js';

export default class PimFacade {
    constructor(page) {
        this.topbarHeader = new TopbarHeader(page);
        this.pimEmployeeList = new PimEmployeeList(page);
        this.pimAddEmployee = new PimAddEmployee(page);
        this.personalDetails = new PimPersonalDetails(page);
        this.confirmDeleteModal = new ConfirmDeleteModal(page);
    }
}
