package site.hanchen.bakery.entities;

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
public class BasePrice {
	
	private @Id @GeneratedValue Long id;
	
	private String shape;
	private Long cents;
	
	public BasePrice(String shape, Long cents) {
		this.shape = shape;
		this.cents = cents;
	}
	
	public String toString() {
		return "BasePrice{\"shape=\""+ this.shape +", \"cents\"="+ this.cents +"}";
	};
}
