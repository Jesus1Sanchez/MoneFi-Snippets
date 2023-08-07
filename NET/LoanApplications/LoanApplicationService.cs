public class LoanApplicationService : ILoanApplicationService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _baseUserMapper = null;

        public LoanApplicationService(
            IDataProvider data,
            ILookUpService lookUpService,
            IBaseUserMapper baseUserMapper
        )
        {
            _data = data;
            _lookUpService = lookUpService;
            _baseUserMapper = baseUserMapper;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[LoanApplications_Delete]";
            _data.ExecuteNonQuery(
                procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }
            );
        }

        public void Update(LoanApplicationUpdateRequest model, int UserId)
        {
            string procName = "[dbo].[LoanApplications_UpdateV2]";
            DataTable loanFilesTable = MapLoanFilesToTable(model.BatchLoanFiles);
            DataTable borrowerCollateralsTable = MapBorrowerCollateralsToTable(
                model.BatchBorrowerCollaterals
            );
            _data.ExecuteNonQuery(
                procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    AddCommonLoanApps(model, col);
                    col.AddWithValue("@ModifiedBy", UserId);
                    col.AddWithValue("@BatchLoanFiles", loanFilesTable);
                    col.AddWithValue("@BatchBorrowerCollaterals", borrowerCollateralsTable);
                },
                returnParameters: null
            );
        }

        public int Insert(LoanApplicationAddRequest model, int UserId)
        {
            int id = 0;

            DataTable loanFilesTable = MapLoanFilesToTable(model.BatchLoanFiles);
            DataTable borrowerCollateralsTable = MapBorrowerCollateralsToTable(model.BatchBorrowerCollaterals);

            _data.ExecuteNonQuery("[dbo].[LoanApplications_InsertV3]", inputParamMapper: (SqlParameterCollection col) =>
            {
                AddCommonLoanApps(model, col);
                col.AddWithValue("@CreatedBy", UserId);
                col.AddWithValue("@BatchLoanFiles", loanFilesTable);
                col.AddWithValue("@BatchBorrowerCollaterals", borrowerCollateralsTable);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: (SqlParameterCollection returnCol) =>
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);

            }
            );
            return id;
        }

        public Paged<LoanApplicationBorrowerBusiness> GetAllPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[LoanApplications_SelectAllV2]";
            Paged<LoanApplicationBorrowerBusiness> pagedResult = null;
            List<LoanApplicationBorrowerBusiness> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                },
                delegate (IDataReader reader, short set)
                {
                    int startIndex = 0;

                    LoanApplicationBorrowerBusiness loanApp = Mapper(reader, ref startIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startIndex++);
                    }

                    if (result == null)
                    {
                        result = new List<LoanApplicationBorrowerBusiness>();
                    }
                    result.Add(loanApp);
                }
            );

            if (result != null)
            {
                pagedResult = new Paged<LoanApplicationBorrowerBusiness>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public List<LoanApplication> GetCurrentPage(int pageIndex, int pageSize, int userId)
        {
            string procName = "[dbo].[LoanApplications_Select_Paged_ByCreatedBy]";
            List<LoanApplication> result = null;
            int totalCount = 0;
            _data.ExecuteCmd(
                procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@Id", userId);
                },
                delegate (IDataReader reader, short set)
                {
                    int startIndex = 0;
                    LoanApplication loanApp = CurrentMapper(reader, ref startIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startIndex++);
                    }
                    if (result == null)
                    {
                        result = new List<LoanApplication>();
                    }
                    result.Add(loanApp);
                }
            );
            return result;
        }

        public Paged<LoanApplicationBorrowerBusiness> GetByTypePaginated(
            int loanTypeId,
            int pageIndex,
            int pageSize
            
        )
        {
            string procName = "[dbo].[LoanApplications_Select_ByLoanTypeV2]";
            Paged<LoanApplicationBorrowerBusiness> pagedResult = null;
            List<LoanApplicationBorrowerBusiness> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@LoanTypeId", loanTypeId);
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                },
                delegate (IDataReader reader, short set)
                {
                    int startIndex = 0;

                    LoanApplicationBorrowerBusiness loanApp = Mapper(reader, ref startIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startIndex++);
                    }
                    if (result == null)
                    {
                        result = new List<LoanApplicationBorrowerBusiness>();
                    }
                    result.Add(loanApp);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<LoanApplicationBorrowerBusiness>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        private LoanApplication CurrentMapper(IDataReader reader, ref int startIndex)
        {
            LoanApplication loanApp = new LoanApplication();
            loanApp.Id = reader.GetSafeInt32(startIndex++);
            loanApp.LoanType = _lookUpService.MapSingleLookUp3Col(reader, ref startIndex);
            loanApp.LoanAmount = reader.GetSafeInt32(startIndex++);
            loanApp.LoanTerm = reader.GetSafeInt32(startIndex++);
            loanApp.PreferredInterestRate = reader.GetSafeDecimal(startIndex++);
            loanApp.CreditScore = reader.GetSafeInt32(startIndex++);
            loanApp.StatusType = _lookUpService.MapSingleLookUp(reader, ref startIndex);
            loanApp.User = _baseUserMapper.MapBaseUser(reader, ref startIndex);
            loanApp.IsBusiness = reader.GetSafeBool(startIndex++);
            loanApp.DateCreated = reader.GetSafeDateTime(startIndex++);
            loanApp.DateModified = reader.GetSafeDateTime(startIndex++);
            loanApp.CreatedBy = reader.GetSafeInt32(startIndex++);
            loanApp.ModifiedBy = reader.GetSafeInt32(startIndex++);
            return loanApp;
        }

        private LoanApplicationBorrowerBusiness Mapper(IDataReader reader, ref int index)
        {
            LoanApplicationBorrowerBusiness model = new LoanApplicationBorrowerBusiness();

            model.Id = reader.GetSafeInt32(index++);
            model.LoanType = _lookUpService.MapSingleLookUp3Col(reader, ref index);
            model.LoanAmount = reader.GetSafeInt32(index++);
            model.LoanTerm = reader.GetSafeInt32(index++);
            model.PreferredInterestRate = reader.GetSafeDecimal(index++);
            model.CreditScore = reader.GetSafeInt32(index++);
            model.StatusType = _lookUpService.MapSingleLookUp(reader, ref index);
            model.IsBusiness = reader.GetSafeBool(index++);
            if (model.IsBusiness)
            {

                model.BusinessProfile = JsonConvert.DeserializeObject<BusinessProfile>(reader.GetSafeString(index++));
            }
            else
            {
                model.Borrower = JsonConvert.DeserializeObject<List<Borrower>>(reader.GetSafeString(index++));   
            }
            model.LoanFiles = JsonConvert.DeserializeObject<List<LoanFile>>(reader.GetSafeString(index++));
            model.DateCreated = reader.GetSafeDateTime(index++);
            model.DateModified = reader.GetSafeDateTime(index++);
            model.CreatedBy = JsonConvert.DeserializeObject<BaseUser>(reader.GetSafeString(index++));
            model.ModifiedBy = JsonConvert.DeserializeObject<BaseUser>(reader.GetSafeString(index++));

            return model;
        }

        private static void AddCommonLoanApps(
            LoanApplicationAddRequest model,
            SqlParameterCollection col
        )
        {
            col.AddWithValue("@LoanTypeId", model.LoanTypeId);
            col.AddWithValue("@LoanAmount", model.LoanAmount);
            col.AddWithValue("@LoanTerm", model.LoanTerm);
            col.AddWithValue("@PreferredInterestRate", model.PreferredInterestRate);
            col.AddWithValue("@CreditScore", model.CreditScore);
            col.AddWithValue("@StatusId", model.StatusId);
            col.AddWithValue("@IsBusiness", model.IsBusiness);
            col.AddWithValue("@SSN", model.SSN);
            col.AddWithValue("@BorrowerStatusId", model.BorrowerStatusId);
            col.AddWithValue("@AnnualIncome", model.AnnualIncome);
            col.AddWithValue("@LocationId", model.LocationId);
        }

        private DataTable MapLoanFilesToTable(List<LoanFileAddRequest> loanFiles)
        {
            DataTable table = new DataTable();
            table.Columns.Add("FileId", typeof(int));
            table.Columns.Add("LoanFileTypeId", typeof(int));

            foreach (var file in loanFiles)
            {
                table.Rows.Add(file.FileId, file.LoanFileTypeId);
            }
            return table;
        }

        private DataTable MapBorrowerCollateralsToTable(
            List<BorrowerCollateralAddRequest> borrowerCollaterals
        )
        {
            DataTable table = new DataTable();
            table.Columns.Add("BorrowerId", typeof(int));
            table.Columns.Add("CollateralTypeId", typeof(int));
            table.Columns.Add("Amount", typeof(decimal));
            table.Columns.Add("Quantity", typeof(int));

            foreach (var collateral in borrowerCollaterals)
            {
                table.Rows.Add(
                    collateral.BorrowerId,
                    collateral.CollateralTypeId,
                    collateral.Amount,
                    collateral.Quantity
                );
            }

            return table;
        }
    }
