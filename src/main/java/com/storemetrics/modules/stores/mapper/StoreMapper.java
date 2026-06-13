package com.storemetrics.modules.stores.mapper;

import com.storemetrics.modules.stores.dto.StoreDto;
import com.storemetrics.modules.stores.entities.Store;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StoreMapper {
    StoreDto toDto(Store store);
    Store toEntity(StoreDto storeDto);
}
