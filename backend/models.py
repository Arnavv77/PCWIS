from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from typing import List, Optional

class ExplainableFactor(BaseModel):
    factor: str
    weight: float

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class PredictRequest(BaseModel):
    fraud_category: str = Field(..., alias="fraudCategory")
    victim_lat: float = Field(..., alias="victimLat")
    victim_lng: float = Field(..., alias="victimLng")
    amount: float = Field(..., alias="amount")

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class PredictResponse(BaseModel):
    advisory_reference_no: str
    risk_classification: str
    target_zone_lat: float
    target_zone_lng: float
    confidence_score: float
    predicted_time_window_start: float
    predicted_time_window_end: float
    estimated_capital_at_risk: float
    explainable_factors: List[ExplainableFactor]

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class ComplaintResponse(BaseModel):
    id: int
    case_reference_no: str
    case_ref: str
    date_time: str
    timestamp: str
    fraud_category: str
    state_ut: str
    state_UT: str
    district: str
    linked_account_reference: str
    mule_account_ref: str
    bank_name: str
    mule_bank: str
    mule_branch_city: str
    atm_target_location: str
    victim_amount: float
    risk_score: int
    status: str
    victim_lat: float
    victim_lng: float
    withdrawal_lat: float
    withdrawal_lng: float
    withdrawal_delay_hours: float
    predicted_time_window: str
    linked_imei: str
    linked_IMEI: str
    ip_address: str
    associated_syndicate: str

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class KpiSummaryResponse(BaseModel):
    total_complaints24h: int
    active_fraud_networks: int
    mule_accounts_flagged: int
    predicted_cash_withdrawal_events: int
    at_risk_capital_secured_cr: float

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
