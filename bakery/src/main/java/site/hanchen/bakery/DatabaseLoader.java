package site.hanchen.bakery;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import site.hanchen.bakery.entities.BasePrice;
import site.hanchen.bakery.entities.Cake;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private BasePriceRepository basePriceRepository;
	private CakeRepository	cakeRepository;
	@Autowired
	public DatabaseLoader(BasePriceRepository repository, CakeRepository cakeRepository) {
		this.basePriceRepository = repository;
		this.cakeRepository = cakeRepository;
	}
	
	@Override
	public void run(String... args) throws Exception {
		// TODO Auto-generated method stub
		this.basePriceRepository.save(new BasePrice("6 inch", (long)8000));
		this.basePriceRepository.save(new BasePrice("8 inch", (long)12000));
		this.basePriceRepository.save(new BasePrice("10 inch", (long)14000));
		this.basePriceRepository.save(new BasePrice("12 inch", (long)16500));
		this.basePriceRepository.save(new BasePrice("14 inch", (long)19000));
		this.basePriceRepository.save(new BasePrice("16 inch", (long)21000));
		
		//List<BasePrice> basePrices = StreamSupport.stream(basePriceRepository.findAll().spliterator(), false).collect(Collectors.toList());
		List<String> cake1_tags = Stream.of("8 inch", "laoren", "xianhua").toList();
		this.cakeRepository.save(new Cake("link1", cake1_tags));
		List<String> cake2_tags = Stream.of("10 inch", "shengri", "yingtao").toList();
		this.cakeRepository.save(new Cake("link2", cake2_tags));
		List<String> cake3_tags = Stream.of("12 inch", "xiaohai", "huangguan").toList();
		this.cakeRepository.save(new Cake("link3", cake3_tags));
		List<String> cake4_tags = Stream.of("14 inch", "hunli", "wanou").toList();
		this.cakeRepository.save(new Cake("link4", cake4_tags));
	}
}
