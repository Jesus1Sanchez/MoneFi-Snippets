public class BorrowerCollateralAddRequest
    {
        [Required]
        public int BorrowerId { get; set; }

        [Required]
        public int CollateralTypeId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }
    }