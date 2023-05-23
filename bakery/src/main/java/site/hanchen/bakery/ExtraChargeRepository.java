package site.hanchen.bakery;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import site.hanchen.bakery.entities.BasePrice;
import site.hanchen.bakery.entities.Cake;
import site.hanchen.bakery.entities.ExtraCharge;

public interface ExtraChargeRepository extends CrudRepository<ExtraCharge, Long> {

}
