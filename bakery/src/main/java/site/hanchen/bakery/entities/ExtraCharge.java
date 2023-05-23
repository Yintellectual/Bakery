package site.hanchen.bakery.entities;

import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode
public class ExtraCharge {
	private @Id @GeneratedValue Long id;
	
	private String name;
	private Long cents;
	
	//@ManyToMany(mappedBy = "extraCharges")
	//Set<Cake> cakes;
	
	public ExtraCharge(String name, Long cents) {
		this.name = name;
		this.cents = cents;
	}
}
