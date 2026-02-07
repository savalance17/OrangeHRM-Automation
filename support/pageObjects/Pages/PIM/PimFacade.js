import TopbarHeader from '../TopbarHeader.js';
import PimEmployeeList from './PimEmployeeList.js';
import PimAddEmployee from './PimAddEmployee.js';
import PimPersonalDetails from './PimPersonalDetails.js';
import ConfirmDeleteModal from '../ConfirmDeleteModal.js';

export default class PimFacade {
    constructor(page) {
        this.topbarHeader = new TopbarHeader(page);
        this.pimEmployeeList = new PimEmployeeList(page);
        this.pimAddEmployee = new PimAddEmployee(page);
        this.personalDetails = new PimPersonalDetails(page);
        this.confirmDeleteModal = new ConfirmDeleteModal(page);
    }
}
