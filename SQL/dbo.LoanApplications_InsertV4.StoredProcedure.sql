ALTER PROC [dbo].[LoanApplications_InsertV4]
	    @LoanTypeId INT,
	    @LoanAmount INT,
	    @LoanTerm INT,
	    @PreferredInterestRate DECIMAL(3,2),
	    @CreditScore INT,
	    @IsBusiness BIT,
	    @CreatedBy INT,
	    @Id INT OUTPUT,
	    @SSN nvarchar(20),
	    @AnnualIncome INT,
	    @LocationId INT,
	    @BatchLoanFiles AS dbo.BatchLoanFiles READONLY,
	    @BatchBorrowerCollaterals AS dbo.BatchBorrowerCollaterals READONLY

AS
/*  ------------------------- Test Code --------------------------------------
INSERT INTO @BatchLoanFiles ( FileId, LoanFileTypeId)
VALUES (602, 2),
       (555, 2)

     
INSERT INTO @BatchBorrowerCollaterals (BorrowerId, CollateralTypeId, Amount, Quantity)
VALUES (@BorrowerId, 3, 10000.00, 1),
       (@BorrowerId, 4, 5000.00, 2)

DECLARE 
		@LoanTypeId int = 1
	       ,@LoanAmount int = 10000
	       ,@LoanTerm int = 36
	       ,@PreferredInterestRate Decimal(3,2) = 3.5
	       ,@CreditScore int = 750
	       ,@StatusId int = 1
	       ,@IsBusiness bit = 0
	       ,@CreatedBy int = 139
	       ,@Id int
	       ,@SSN nvarchar(20) = '333-33-3333'
	       ,@BorrowerStatusId int= 4
	       ,@AnnualIncome int = 800000
	       ,@LocationId int = 7
               ,@BatchLoanFiles dbo.BatchLoanFiles
       	       ,@BatchBorrowerCollaterals dbo.BatchBorrowerCollaterals
		

EXEC [dbo].[LoanApplications_InsertV4]
	       @LoanTypeId
	      ,@LoanAmount
	      ,@LoanTerm
	      ,@PreferredInterestRate
	      ,@CreditScore
	      ,@StatusId
	      ,@IsBusiness
	      ,@CreatedBy
	      ,@Id OUTPUT
	      ,@SSN 
	      ,@BorrowerStatusId 
	      ,@AnnualIncome 
	      ,@LocationId  
	      ,@BatchLoanFiles
	      ,@BatchBorrowerCollaterals

SELECT *
FROM dbo.LoanApplications
Where Id = @Id

SELECT *
From dbo.Files



*/--------------------      End of Test Code -----------------------------------------
BEGIN

SET XACT_ABORT ON
	
Declare @Tran nvarchar(50)  = 'LoanApplications_InsertV4_Transaction'
		
BEGIN TRY

BEGIN Transaction @Tran

DECLARE 	@DateCreated DATETIME2 = GETUTCDATE(),
           	@DateModified DATETIME2 = GETUTCDATE(),
		@StatusId int = 3
			
    INSERT INTO dbo.LoanApplications 
		(LoanTypeId,
                LoanAmount,
                LoanTerm,
                PreferredInterestRate,
                CreditScore,
                StatusId,
                IsBusiness,
                CreatedBy,
        	ModifiedBy)
	VALUES 
		(@LoanTypeId,
		@LoanAmount,
		@LoanTerm,
		@PreferredInterestRate,
		@CreditScore,
		@StatusId,
		@IsBusiness,
		@CreatedBy,
		@CreatedBy)

    	SET @Id = SCOPE_IDENTITY();

	Declare 
		@BorrowerId int = 0,
		@BorrowerStatusId int = 3;

	SET @BorrowerId = (SELECT id from dbo.Borrowers where UserId = @CreatedBy)

	Declare @TempQ int = 
		(Select LFT.Id
		
		From [dbo].[LoanFileTypes] as LFT
		
		inner join [dbo].[Files] as F
		
		On F.[FileTypeId] = LFT.[Id]
		
		Where Exists 
		
		(Select 1
		
		From @BatchLoanFiles as B
		
		Where B.[FileId] = F.[Id]))
						
    INSERT INTO dbo.LoanFiles 
		(LoanId,
		FileId,
		LoanFileTypeId)

    	(SELECT @Id, B.FileId, @TempQ 
		
	FROM @BatchLoanFiles as B
		
	where Exists (Select 1
		
	From [dbo].[Files] as F
		
	Where B.[FileId] = F.[Id]))

    UPDATE [dbo].[Borrowers]
     	SET 
		[AnnualIncome] = @AnnualIncome
	   	,[LocationId] = @LocationId
	   	,[DateModified] = @DateModified
   	WHERE Id = @BorrowerId

    INSERT INTO dbo.BorrowerCollateral 
		(BorrowerId
		,CollateralTypeId
		,Amount
		,Quantity)
													
    SELECT      @BorrowerId
		,CollateralTypeId
		,Amount
		,Quantity 
    FROM @BatchBorrowerCollaterals

Commit Transaction @Tran

END TRY
BEGIN Catch

    IF (XACT_STATE()) = -1
    BEGIN
        PRINT 'The transaction is in an uncommittable state.' +
              ' Rolling back transaction.'
        ROLLBACK TRANSACTION @Tran;;
    END;

    -- Test whether the transaction is active and valid.
    IF (XACT_STATE()) = 1
    BEGIN
        PRINT 'The transaction is committable.' +
              ' Committing transaction.'
        COMMIT TRANSACTION @Tran;;
    END;

        -- If you want to see error info
       -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
       -- ERROR_PROCEDURE() AS ErrorProcedure,
       -- ERROR_LINE() AS ErrorLine,
       -- ERROR_MESSAGE() AS ErrorMessage

-- to just get the error thrown and see the bad news as an exception
    THROW

End Catch
	    
SET XACT_ABORT OFF



    
END
GO
