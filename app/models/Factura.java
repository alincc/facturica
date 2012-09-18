package models;

import listener.FacturaListener;
import play.data.binding.As;
import play.data.validation.Required;
import play.db.jpa.Model;

import javax.persistence.*;
import java.util.*;

@Entity
@EntityListeners(FacturaListener.class)
public class Factura extends Model
{
    @Required
    public String docNo;

    @Temporal(value = TemporalType.DATE)
    @As(value = "dd-MM-yyyy")
    public Date docDate;

    @Temporal(value = TemporalType.DATE)
    @As(value = "dd-MM-yyyy")
    public Date docDueDate;

    @OneToMany(mappedBy="parent", cascade=CascadeType.ALL, orphanRemoval=true)
    public Set<FacturaItem> items = new HashSet<FacturaItem>();

    public double subtotal = 0;

    public double vat = 0;

    public double total = 0;

    public double payment = 0;

    @Embedded
    public Partner client;

    @Embedded
    public History history;

    public String nraviz;

    public String numeDelegat;

    public String ciSeria;
    public String ciNumar;
    public String cnp;
    public String detaliuTransport;

    @Temporal(value = TemporalType.DATE)
    @As(value = "dd-MM-yyyy")
    public Date expDate;

    public String note;

    public Factura()
    {
        items = new HashSet<FacturaItem>();
        client = new Partner();
        history = new History();
    }


}
