using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.LoanApplications
{
    public class LoanApplicationAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int LoanTypeId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int LoanAmount { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int LoanTerm { get; set; }

        [Required]
        [Range(0, 9.9999)]
        public decimal PreferredInterestRate { get; set; }

        [Required]
        public int CreditScore { get; set; }

        [Required]
        [Range(1, 5)]
        public int StatusId { get; set; }

        [Required]
        public bool IsBusiness { get; set; }

        public string SSN { get; set; }

        public int BorrowerStatusId { get; set; }

        public int AnnualIncome { get; set; }

        public int LocationId { get; set; }

        public List<LoanFileAddRequest> BatchLoanFiles { get; set; }

        public List<BorrowerCollateralAddRequest> BatchBorrowerCollaterals { get; set; }
    }
}
