package site.hanchen.bakery.entities;

import java.util.List;
import java.util.ArrayList;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode
public class Cake {

	private @Id @GeneratedValue Long id;

	private String photo;
    
	//There are 2 sets of base prices
	//private BasePriceSet basePriceSet;
	//Should be a multi-to-multi relationship
//	@ManyToMany
//	@JoinTable(
//			name="cake_extraCharges", 
//			joinColumns = @JoinColumn(name = "cake_id"),
//			inverseJoinColumns = @JoinColumn(name = "extraCharge_id")
//	)
//    private List<ExtraCharge> extraCharges = new ArrayList<>();
	
    @ElementCollection
    private List<String> tags = new ArrayList<>();
    
	public Cake(String photo, List<String> tags) {
		this.photo = photo;
		//this.basePrices = basePrices;
		this.tags = tags;
	}
}
