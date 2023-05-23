package site.hanchen.bakery;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import site.hanchen.bakery.entities.BasePrice;
import site.hanchen.bakery.entities.Cake;

public interface CakeRepository extends CrudRepository<Cake, Long>, PagingAndSortingRepository<Cake, Long> {

	@Query("SELECT s FROM Cake s JOIN s.tags t WHERE t = LOWER(:tag)")
	List<Cake> retrieveByTag(@Param("tag") String tag);
	
	@Query("SELECT s FROM Cake s WHERE s.photo = :photo")
	List<Cake> retrieveByPhoto(@Param("photo") String photo);
}
