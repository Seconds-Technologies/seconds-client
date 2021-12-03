import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const MultiDropQuote = ({ show, numDropoffs, toggleShow, confirm }) => {
	return (
		<Modal show={show} onHide={() => toggleShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Selection</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<div>
					<table className='table'>
						<thead>
							<tr>
								<th scope='col'>Number of dropoffs</th>
								<th scope='col'>Price (per drop)</th>
								<th scope='col'>Total</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className='col'>{numDropoffs}</td>
								<td className='col'>£7</td>
								<td className='col'>£{7 * numDropoffs}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={confirm}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

MultiDropQuote.propTypes = {
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	numDropoffs: PropTypes.number.isRequired,
	confirm: PropTypes.func.isRequired
};

export default MultiDropQuote;
