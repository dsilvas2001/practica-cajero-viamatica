CREATE OR REPLACE PROCEDURE sp_cancel_contract(
    p_contract_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar existencia del contrato
    IF NOT EXISTS (SELECT 1 FROM contract WHERE contractid = p_contract_id) THEN
        RAISE EXCEPTION 'Contrato no encontrado';
    END IF;
    
    -- Validar que no esté ya cancelado
    IF EXISTS (SELECT 1 FROM contract WHERE contractid = p_contract_id AND "contractStatusStatusid" = 'CAN') THEN -- ¡Usar comillas!
        RAISE EXCEPTION 'El contrato ya está cancelado';
    END IF;
    
    -- Validar estado CAN existe
    IF NOT EXISTS (SELECT 1 FROM status_contract WHERE statusid = 'CAN') THEN
        RAISE EXCEPTION 'Estado CAN no configurado';
    END IF;
    
    -- Actualizar contrato
    UPDATE contract
    SET 
        "contractStatusStatusid" = 'CAN', -- ¡Usar comillas!
        enddate = CURRENT_TIMESTAMP
    WHERE contractid = p_contract_id;
    
END;
$$;