CREATE OR REPLACE PROCEDURE sp_change_payment_method(
    p_contract_id VARCHAR,
    p_new_method_id VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar existencia del contrato
    IF NOT EXISTS (SELECT 1 FROM contract WHERE contractid = p_contract_id) THEN
        RAISE EXCEPTION 'Contrato no encontrado';
    END IF;
    
    -- Validar nuevo método de pago
    IF NOT EXISTS (SELECT 1 FROM method_payment WHERE methodpaymentid = p_new_method_id) THEN
        RAISE EXCEPTION 'Método de pago no válido';
    END IF;
    
    -- Actualizar método de pago
    UPDATE contract
    SET "methodPaymentMethodpaymentid" = p_new_method_id
    WHERE contractid = p_contract_id;
    
END;
$$;