using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.LoanApplications
{
    public class LoanFileAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int FileId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int LoanFileTypeId { get; set; }
    }
}
