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

    public String item;

    public String um;

    public Double qty;

    public Double pu;

    public Double subtotal;

    public Double vat;

    public Double vatAmount;

    public Double total;

//    @PrePersist
//    @PreUpdate
//    protected void updateTotalsIfEmpty()
//    {
//        subtotal = qty * pu;
//        vatAmount = subtotal * vat;
//        total = subtotal + vatAmount;
//    }
}
