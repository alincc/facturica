package models;

import play.data.binding.As;
import play.data.validation.Required;
import play.db.jpa.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class FacturaItem extends Model
{
    public String itemId;

    public String item = "";

    public String um = "";

    public Double qty= 0d;

    public Double pu= 0d;

    public Double subtotal = 0d;

    public Double vat= 0d;

    public Double vatAmount= 0d;

    public Double total= 0d;

    @ManyToOne
        @JoinTable(name = "CHILDREN_WITH_PARENT",
                joinColumns = {@JoinColumn(name = "CHILD_ID")},
                inverseJoinColumns = {@JoinColumn(name = "PARENT_ID")}
        )
    private Factura parent;

//    @PrePersist
//    @PreUpdate
//    protected void updateTotalsIfEmpty()
//    {
//        subtotal = qty * pu;
//        vatAmount = subtotal * vat;
//        total = subtotal + vatAmount;
//    }
}
