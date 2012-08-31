package models;

import play.db.jpa.Model;

import javax.persistence.Embeddable;
import javax.persistence.Entity;

@Entity
public class Item extends Model
{
    public String itemId;

    public String item;

    public String um;

    public Double qty;

    public Double pu;

    public Double subtotal;

    public Double vat;

    public Double total;
}
