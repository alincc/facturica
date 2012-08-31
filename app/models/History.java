package models;


import play.data.binding.As;

import javax.persistence.Embeddable;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Embeddable
public class History
{
    @Temporal(value = TemporalType.DATE)
    @As(value = "dd-MM-yyyy")
    public Date dateCreated;

    @Temporal(value = TemporalType.DATE)
    @As(value = "dd-MM-yyyy")
    public Date lastUpdated;

}
