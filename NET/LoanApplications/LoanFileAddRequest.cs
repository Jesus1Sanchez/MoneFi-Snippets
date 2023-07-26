public class LoanFileAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int FileId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int LoanFileTypeId { get; set; }
    }