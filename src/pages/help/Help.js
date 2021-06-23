import React, { Component } from "react";
import telephone from "../../img/telephone.svg";
import mail from "../../img/mail.svg";
import "./help.css";

class Help extends Component {
	render() {
		return (
			<div className='help py-lg-5 py-md-5 py-4'>
				<div className='container-fluid py-5'>
					<div className='row pb-3 text-center'>
						<div className='col'>
							<p className='display-4 fw-bold fw-bolder'>Need help with an order?</p>
						</div>
					</div>
					<div className='row pb-3 text-center'>
						<div className='col'>
							<p className='text-muted h3'>Chat with us via telephone or email</p>
						</div>
					</div>
					<hr className="my-5 mx-5"/>
					<div className='d-flex justify-content-center align-items-center'>
						<div>
							<table className='table table-borderless align-middle'>
								<tbody className="">
									<tr className="d-flex my-3">
										<td>
											<div>
												<img src={telephone} alt='' />
											</div>
										</td>
										<td>
											<span className="h3 help-text">+447895254476</span>
										</td>
									</tr>
									<tr className="d-flex my-3">
										<td>
											<img src={mail} alt='' />
										</td>
										<td>
											<span className="h3 help-text">secondsdelivery@gmail.com</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					{/*<div className='row test2'>
						<div className='col d-flex justify-content-center w-100'>
							<img src={telephone} alt='' />
							<span>+447895254476</span>
						</div>
					</div>
					<div className='row test2'>
						<div className='col d-flex justify-content-center w-100'>
							<img src={mail} alt='' />
							<span>secondsdelivery@gmail.com</span>
						</div>
					</div>*/}
				</div>
			</div>
		);
	}
}

export default Help;