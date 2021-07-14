export enum AbortCode {
  reference_id_not_found = "reference_id_not_found",
  risk_checks_failed = "risk_checks_failed",
  missing_information = "missing_information",
  payment_type_mismatch = "payment_type_mismatch",
  invalid_command_type = "invalid_command_type",
  unspecified_error = "unspecified_error",
  unable_to_submit_transaction = "unable_to_submit_transaction",
  user_declined_payment = "user_declined_payment",
}
