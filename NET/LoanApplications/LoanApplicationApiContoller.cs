    [Route("api/loanapplications")]
    [ApiController]
    public class LoanApplicationApiController : BaseApiController
    {

        private ILoanApplicationService _loanApplicationService = null;
        private IAuthenticationService<int> _authenticationService = null;

        public LoanApplicationApiController(ILoanApplicationService service,
            ILogger<LoanApplicationApiController> logger,
            IAuthenticationService<int> authenticationService) : base(logger)
        {
            _loanApplicationService = service;
            _authenticationService = authenticationService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(LoanApplicationAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {

                int userId = _authenticationService.GetCurrentUserId();

                int id = _loanApplicationService.Insert(model, userId);
                ItemResponse<int> itemResponse = new ItemResponse<int>() { Item = id };

                response = itemResponse;

                code = 201;
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(LoanApplicationUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authenticationService.GetCurrentUserId();
                _loanApplicationService.Update(model, userId);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _loanApplicationService.Delete(id);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);
        }

        [HttpGet("paginated")]
        public ActionResult<ItemResponse<Paged<LoanApplicationBorrowerBusiness>>> GetAllPaginated(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<LoanApplicationBorrowerBusiness> list = _loanApplicationService.GetAllPaginated(pageIndex, pageSize);


                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Loan applications not found.");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<Paged<LoanApplicationBorrowerBusiness>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<LoanApplicationBorrowerBusiness>>> SearchPagination( string query,int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<LoanApplicationBorrowerBusiness> list = _loanApplicationService.SearchPagination(query,pageIndex, pageSize );

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<LoanApplicationBorrowerBusiness>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("business")]
        public ActionResult<ItemResponse<Paged<LoanApplicationBorrowerBusiness>>> GetBusinessPaginated(int pageNumber, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<LoanApplicationBorrowerBusiness> list = _loanApplicationService.GetAllPaginated(pageNumber, pageSize);


                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Business loan applications not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<LoanApplicationBorrowerBusiness>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("personal")]
        public ActionResult<ItemResponse<Paged<LoanApplicationBorrowerBusiness>>> GetPersonalPaginated(int pageNumber, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<LoanApplicationBorrowerBusiness> list = _loanApplicationService.GetAllPaginated(pageNumber, pageSize);


                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Personal loan applications not found.");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<Paged<LoanApplicationBorrowerBusiness>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("type")]
        public ActionResult<ItemResponse<Paged<LoanApplicationBorrowerBusiness>>> GetTypePaginated(int loanTypeId, int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;
           
            try
            {
                Paged<LoanApplicationBorrowerBusiness> list = _loanApplicationService.GetByTypePaginated(loanTypeId, pageIndex, pageSize);

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Personal loan applications not found.");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<Paged<LoanApplicationBorrowerBusiness>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

    }
