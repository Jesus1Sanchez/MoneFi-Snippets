import * as Yup from "yup";

const loanApplicationSchema = {};

loanApplicationSchema.locationStep = () =>{
	return Yup.object().shape({
	lineOne:Yup.string().required("Please insert location")
});}

loanApplicationSchema.step1 = () =>{
	return Yup.object().shape({
	loanTerm: Yup.number().min(1,"insert a number greater than zero").required("Please Select Loant Term"),
	loanAmount: Yup.number().min(1,"insert a number greater than zero").max(1000000000).required("Required"),
	loanTypeId: Yup.number().min(1,"insert a number greater than zero").required("Please Select LoanType"),
	preferredInterestRate: Yup.number().min(.001).max(9).required("Required"),
	creditScore: Yup.number().min(1,"insert a number greater than zero").required("Please Select Credit Score"),
});}

loanApplicationSchema.colateralTest = () =>{
	return Yup.object().shape({
	
		collateralTypeId: Yup.number().min(0).max(9999999999).required("Required"),
		amount: Yup.number().min(1,"insert a number greater than zero").max(9999999999,"Insert a Smaller Number").required("Required"),
		quantity: Yup.number().min(1,"insert a number greater than zero").max(9999999999,"Insert a Smaller Number").required("Required"),
	
	});}

loanApplicationSchema.colateral = () =>{
	return Yup.object().shape({
	batchBorrowerCollaterals: Yup.array()
	.of(Yup.object().shape({
		collateralTypeId: Yup.number().min(0).max(9999999999).required("Required"),
		amount: Yup.number("Needs to be a number").min(1,"insert a number greater than zero").max(9999999999,"Insert a Smaller Number").required("Required"),
		quantity: Yup.number().min(1,"insert a number greater than zero").max(9999999999,"Insert a Smaller Number").required("Required"),
	}).required("Required")).required("required")
	
	}).required("required");}




export default loanApplicationSchema;