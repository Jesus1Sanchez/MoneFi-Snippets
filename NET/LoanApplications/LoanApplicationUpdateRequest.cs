using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.LoanApplications
{
    public class LoanApplicationUpdateRequest : LoanApplicationAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
