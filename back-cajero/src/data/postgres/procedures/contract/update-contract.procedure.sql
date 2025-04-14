CREATE OR REPLACE PROCEDURE sp_change_contract_service(
    p_contract_id UUID,
    p_new_service_id UUID,
    OUT p_new_contract_id VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar existencia del contrato
    IF NOT EXISTS (SELECT 1 FROM contract WHERE contractid = p_contract_id) THEN
        RAISE EXCEPTION 'Contrato no encontrado';
    END IF;
    
    -- Validar nuevo servicio
    IF NOT EXISTS (SELECT 1 FROM service WHERE serviceid = p_new_service_id) THEN
        RAISE EXCEPTION 'Nuevo servicio no válido';
    END IF;
    
    -- Validar estado SUS existe
    IF NOT EXISTS (SELECT 1 FROM status_contract WHERE statusid = 'SUS') THEN
        RAISE EXCEPTION 'Estado SUS no configurado';
    END IF;
    
    -- 1. Marcar contrato existente como SUS
    UPDATE contract 
    SET "contractStatusStatusid" = 'SUS'
    WHERE contractid = p_contract_id;
    
    -- 2. Crear nuevo contrato con estado VIG
    INSERT INTO contract (
        startdate,
        enddate,
        "serviceServiceid",
        "clientClientid",
        "methodPaymentMethodpaymentid",
        "contractStatusStatusid"
    )
    SELECT 
        CURRENT_DATE,       -- Valor para startdate (nueva fecha actual)
        enddate,            -- Valor para enddate (copiado del contrato original)
        p_new_service_id,   -- Valor para service_id (el nuevo servicio que pasaste como parámetro)
      "clientClientid",
        "methodPaymentMethodpaymentid",
        'VIG'               -- Valor para contract_status_id (nuevo estado)
    FROM contract
    WHERE contractid = p_contract_id
    RETURNING contractid INTO p_new_contract_id;
    
END;
$$;